# 📱 Guia Completo - Implementação Mobile com Expo

## 🎯 Visão Geral

Este guia detalha a implementação de um aplicativo mobile com Expo baseado na arquitetura web atual do Equipe Ativa. O app incluirá autenticação, navegação entre organizações/unidades e agenda pessoal.

---

## 📋 Índice

1. [Configuração Inicial](#1-configuração-inicial)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Autenticação](#3-autenticação)
4. [Navegação](#4-navegação)
5. [API Client](#5-api-client)
6. [Telas Principais](#6-telas-principais)
7. [Gerenciamento de Estado](#7-gerenciamento-de-estado)
8. [Recursos Nativos](#8-recursos-nativos)

---

## 1. Configuração Inicial

### 1.1 Criar Projeto Expo

```bash
npx create-expo-app@latest equipe-ativa-mobile --template tabs
cd equipe-ativa-mobile
```

### 1.2 Instalar Dependências Essenciais

```bash
# Navegação
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Autenticação e Storage
npx expo install expo-secure-store expo-auth-session expo-web-browser

# HTTP Client
npm install ky date-fns

# Forms e Validação
npm install react-hook-form @hookform/resolvers zod

# UI Components
npm install react-native-paper
npx expo install react-native-vector-icons

# Estado Global
npm install @tanstack/react-query zustand

# Utils
npm install libphonenumber-js
```

### 1.3 Configuração do app.json

```json
{
  "expo": {
    "name": "Equipe Ativa",
    "slug": "equipe-ativa-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.equipeativa.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "package": "com.equipeativa.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "scheme": "equipeativa",
    "plugins": [
      "expo-secure-store"
    ]
  }
}
```

---

## 2. Estrutura de Pastas

```
equipe-ativa-mobile/
├── app/                          # App Router (Expo Router)
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (app)/                    # Grupo de rotas autenticadas
│   │   ├── _layout.tsx
│   │   ├── (tabs)/               # Navegação por abas
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx         # Dashboard
│   │   │   ├── agenda.tsx        # Minha Agenda
│   │   │   └── profile.tsx       # Perfil
│   │   ├── organizations/
│   │   │   ├── index.tsx         # Lista de Orgs
│   │   │   └── [slug].tsx        # Detalhes da Org
│   │   ├── units/
│   │   │   ├── index.tsx         # Lista de Units
│   │   │   └── [slug].tsx        # Detalhes da Unit
│   │   └── demands/
│   │       ├── index.tsx         # Lista de Demandas
│   │       └── [id].tsx          # Detalhes da Demanda
│   └── _layout.tsx               # Root Layout
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                   # Componentes de UI base
│   │   ├── auth/                 # Componentes de autenticação
│   │   ├── organizations/        # Componentes de organizações
│   │   ├── units/                # Componentes de unidades
│   │   └── agenda/               # Componentes de agenda
│   ├── services/                 # Serviços e APIs
│   │   ├── api/
│   │   │   ├── client.ts         # Cliente HTTP (Ky)
│   │   │   ├── auth.ts           # Endpoints de autenticação
│   │   │   ├── organizations.ts  # Endpoints de organizações
│   │   │   ├── units.ts          # Endpoints de unidades
│   │   │   └── demands.ts        # Endpoints de demandas
│   │   └── storage/
│   │       └── secure-storage.ts # Gerenciamento seguro de tokens
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useOrganizations.ts
│   │   └── useAgenda.ts
│   ├── store/                    # Zustand Store
│   │   ├── auth.ts
│   │   ├── organization.ts
│   │   └── unit.ts
│   ├── types/                    # TypeScript Types
│   │   ├── auth.ts
│   │   ├── organization.ts
│   │   ├── unit.ts
│   │   └── demand.ts
│   ├── utils/                    # Utilitários
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   └── date.ts
│   └── constants/                # Constantes
│       ├── colors.ts
│       └── config.ts
└── assets/                       # Imagens e recursos
```

---

## 3. Autenticação

### 3.1 Secure Storage (src/services/storage/secure-storage.ts)

```typescript
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const secureStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },

  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
};
```

### 3.2 API Client (src/services/api/client.ts)

```typescript
import ky, { type KyInstance } from 'ky';
import { secureStorage } from '../storage/secure-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.equipeativa.com.br';

export const createApiClient = (): KyInstance => {
  return ky.create({
    prefixUrl: API_URL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    hooks: {
      beforeRequest: [
        async (request) => {
          const token = await secureStorage.getToken();
          
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
            console.log('✅ Authorization header set');
          } else {
            console.warn('⚠️ No auth token found');
          }
        },
      ],
      beforeError: [
        (error) => {
          console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.request?.url,
            message: error.message,
          });

          // Redirect para login em caso de erro 401
          if (error.response?.status === 401) {
            console.error('🔒 Authentication failed!');
            // Aqui você pode adicionar navegação para tela de login
          }

          return error;
        },
      ],
    },
  });
};

export const api = createApiClient();
```

### 3.3 Auth Service (src/services/api/auth.ts)

```typescript
import { api } from './client';
import { secureStorage } from '../storage/secure-storage';

interface SignInWithPasswordRequest {
  email: string;
  password: string;
}

interface SignInWithPasswordResponse {
  token: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export const authService = {
  async signInWithPassword({ email, password }: SignInWithPasswordRequest): Promise<string> {
    const response = await api
      .post('sessions/password', {
        json: { email, password },
      })
      .json<SignInWithPasswordResponse>();

    // Salvar token no secure storage
    await secureStorage.saveToken(response.token);

    return response.token;
  },

  async signOut(): Promise<void> {
    await secureStorage.removeToken();
  },

  async getProfile(): Promise<UserProfile> {
    return api.get('profile').json<UserProfile>();
  },

  async isAuthenticated(): Promise<boolean> {
    return secureStorage.hasToken();
  },
};
```

### 3.4 Auth Store (src/store/auth.ts)

```typescript
import { create } from 'zustand';
import { authService } from '../services/api/auth';

interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await authService.signInWithPassword({ email, password });
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    const isAuth = await authService.isAuthenticated();
    set({ isAuthenticated: isAuth });
    return isAuth;
  },
}));
```

### 3.5 Tela de Login (app/(auth)/sign-in.tsx)

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace('/(app)/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={styles.linkText}>
            Não tem uma conta? Criar conta gratuita
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: 8,
  },
});
```

---

## 4. Navegação

### 4.1 Root Layout (app/_layout.tsx)

```typescript
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/auth';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirecionar para login se não autenticado
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirecionar para app se autenticado
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
```

### 4.2 Auth Layout (app/(auth)/_layout.tsx)

```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

### 4.3 App Layout (app/(app)/_layout.tsx)

```typescript
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="organizations/index" 
        options={{ title: 'Organizações' }} 
      />
      <Stack.Screen 
        name="organizations/[slug]" 
        options={{ title: 'Detalhes da Organização' }} 
      />
      <Stack.Screen 
        name="units/index" 
        options={{ title: 'Unidades' }} 
      />
      <Stack.Screen 
        name="units/[slug]" 
        options={{ title: 'Detalhes da Unidade' }} 
      />
    </Stack>
  );
}
```

### 4.4 Tabs Layout (app/(app)/(tabs)/_layout.tsx)

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Minha Agenda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## 5. API Client - Endpoints

### 5.1 Organizations Service (src/services/api/organizations.ts)

```typescript
import { api } from './client';

interface Organization {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
}

interface GetOrganizationsResponse {
  organizations: Organization[];
}

export const organizationsService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await api.get('organizations').json<GetOrganizationsResponse>();
    return response.organizations;
  },

  async getOrganization(slug: string): Promise<Organization> {
    return api.get(`organizations/${slug}`).json<Organization>();
  },
};
```

### 5.2 Units Service (src/services/api/units.ts)

```typescript
import { api } from './client';

interface Unit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
}

interface GetUnitsResponse {
  units: Unit[];
}

export const unitsService = {
  async getUnits(orgSlug: string): Promise<Unit[]> {
    const response = await api
      .get(`organizations/${orgSlug}/units`)
      .json<GetUnitsResponse>();
    return response.units;
  },

  async getUnit(orgSlug: string, unitSlug: string): Promise<Unit> {
    return api
      .get(`organizations/${orgSlug}/units/${unitSlug}`)
      .json<Unit>();
  },
};
```

### 5.3 Demands Service (src/services/api/demands.ts)

```typescript
import { api } from './client';

interface Demand {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  applicant: {
    id: string;
    name: string;
    cpf: string;
    phone: string;
  };
}

interface GetMyDemandsResponse {
  demands: Demand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GetMyDemandsParams {
  organizationSlug: string;
  unitSlug: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
}

export const demandsService = {
  async getMyDemands({
    organizationSlug,
    unitSlug,
    page = 1,
    limit = 20,
    status,
    priority,
    category,
  }: GetMyDemandsParams): Promise<GetMyDemandsResponse> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category }),
    });

    return api
      .get(
        `organizations/${organizationSlug}/units/${unitSlug}/members/my-demands?${searchParams}`
      )
      .json<GetMyDemandsResponse>();
  },

  async getDemand(
    organizationSlug: string,
    unitSlug: string,
    demandId: string
  ): Promise<Demand> {
    return api
      .get(`organizations/${organizationSlug}/units/${unitSlug}/demands/${demandId}`)
      .json<Demand>();
  },
};
```

---

## 6. Telas Principais

### 6.1 Dashboard (app/(app)/(tabs)/index.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { organizationsService } from '../../../src/services/api/organizations';
import { useAuthStore } from '../../../src/store/auth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationsService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrganizations();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name || 'Usuário'}!</Text>
        <Text style={styles.subtitle}>Suas Organizações</Text>
      </View>

      <FlatList
        data={organizations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/organizations/${item.slug}`)}
          >
            <View style={styles.cardContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>Acessar unidades</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhuma organização encontrada
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
```

### 6.2 Lista de Unidades (app/(app)/units/index.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { unitsService } from '../../../src/services/api/units';
import { Ionicons } from '@expo/vector-icons';

interface Unit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
}

export default function UnitsScreen() {
  const router = useRouter();
  const { orgSlug } = useLocalSearchParams<{ orgSlug: string }>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUnits = async () => {
    if (!orgSlug) return;
    
    try {
      const unitsList = await unitsService.getUnits(orgSlug);
      setUnits(unitsList);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, [orgSlug]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUnits();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/units/${item.slug}?orgSlug=${orgSlug}`)}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="business" size={32} color="#3b82f6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.cardDescription}>{item.description}</Text>
                )}
                {item.location && (
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={14} color="#6b7280" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="business-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhuma unidade encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});
```

### 6.3 Minha Agenda (app/(app)/(tabs)/agenda.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { demandsService } from '../../../src/services/api/demands';
import { useOrganizationStore } from '../../../src/store/organization';
import { useUnitStore } from '../../../src/store/unit';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Demand {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  applicant: {
    id: string;
    name: string;
    cpf: string;
    phone: string;
  };
}

export default function AgendaScreen() {
  const router = useRouter();
  const { currentOrganization } = useOrganizationStore();
  const { currentUnit } = useUnitStore();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDemands = async () => {
    if (!currentOrganization?.slug || !currentUnit?.slug) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await demandsService.getMyDemands({
        organizationSlug: currentOrganization.slug,
        unitSlug: currentUnit.slug,
        page: 1,
        limit: 20,
      });
      setDemands(response.demands);
    } catch (error) {
      console.error('Error loading demands:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDemands();
  }, [currentOrganization, currentUnit]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDemands();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return '#ef4444';
      case 'média':
        return '#f59e0b';
      case 'baixa':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
        return '#10b981';
      case 'em_andamento':
        return '#3b82f6';
      case 'pendente':
        return '#f59e0b';
      case 'cancelada':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
        {currentOrganization && currentUnit && (
          <Text style={styles.subtitle}>
            {currentOrganization.name} • {currentUnit.name}
          </Text>
        )}
      </View>

      <FlatList
        data={demands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/demands/${item.id}?orgSlug=${currentOrganization?.slug}&unitSlug=${currentUnit?.slug}`
              )
            }
          >
            <View style={styles.cardHeader}>
              <View style={styles.badges}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getPriorityColor(item.priority) },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.priority}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.applicantInfo}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.applicantName}>{item.applicant.name}</Text>
              </View>

              {item.scheduledDate && item.scheduledTime && (
                <View style={styles.scheduleInfo}>
                  <Ionicons name="calendar" size={16} color="#3b82f6" />
                  <Text style={styles.scheduleText}>
                    {format(new Date(item.scheduledDate), 'dd/MM', {
                      locale: ptBR,
                    })}{' '}
                    às {item.scheduledTime}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhuma demanda encontrada</Text>
            <Text style={styles.emptySubtext}>
              {!currentOrganization || !currentUnit
                ? 'Selecione uma organização e unidade'
                : 'Você não tem demandas atribuídas'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantName: {
    fontSize: 14,
    color: '#6b7280',
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
```

---

## 7. Gerenciamento de Estado

### 7.1 Organization Store (src/store/organization.ts)

```typescript
import { create } from 'zustand';
import { organizationsService } from '../services/api/organizations';

interface Organization {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
}

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;

  loadOrganizations: () => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
  clearCurrentOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organizations: [],
  currentOrganization: null,
  isLoading: false,

  loadOrganizations: async () => {
    set({ isLoading: true });
    try {
      const orgs = await organizationsService.getOrganizations();
      set({ organizations: orgs, isLoading: false });
    } catch (error) {
      console.error('Error loading organizations:', error);
      set({ isLoading: false });
    }
  },

  setCurrentOrganization: (org: Organization) => {
    set({ currentOrganization: org });
  },

  clearCurrentOrganization: () => {
    set({ currentOrganization: null });
  },
}));
```

### 7.2 Unit Store (src/store/unit.ts)

```typescript
import { create } from 'zustand';
import { unitsService } from '../services/api/units';

interface Unit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
}

interface UnitState {
  units: Unit[];
  currentUnit: Unit | null;
  isLoading: boolean;

  loadUnits: (orgSlug: string) => Promise<void>;
  setCurrentUnit: (unit: Unit) => void;
  clearCurrentUnit: () => void;
}

export const useUnitStore = create<UnitState>((set) => ({
  units: [],
  currentUnit: null,
  isLoading: false,

  loadUnits: async (orgSlug: string) => {
    set({ isLoading: true });
    try {
      const units = await unitsService.getUnits(orgSlug);
      set({ units, isLoading: false });
    } catch (error) {
      console.error('Error loading units:', error);
      set({ isLoading: false });
    }
  },

  setCurrentUnit: (unit: Unit) => {
    set({ currentUnit: unit });
  },

  clearCurrentUnit: () => {
    set({ currentUnit: null });
  },
}));
```

---

## 8. Recursos Nativos

### 8.1 Notificações Push (opcional)

```bash
npx expo install expo-notifications
```

```typescript
// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  return token;
}
```

### 8.2 Configuração de Variáveis de Ambiente

Criar arquivo `.env`:

```bash
# API
EXPO_PUBLIC_API_URL=https://api.equipeativa.com.br

# OAuth (se implementar Google Sign In)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id

# Outras configurações
EXPO_PUBLIC_APP_SCHEME=equipeativa
```

---

## 9. Scripts package.json

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "prebuild": "expo prebuild",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios"
  }
}
```

---

## 10. Checklist de Implementação

### ✅ Fase 1: Setup Básico
- [ ] Criar projeto Expo
- [ ] Instalar dependências
- [ ] Configurar navegação básica
- [ ] Configurar API client

### ✅ Fase 2: Autenticação
- [ ] Implementar Secure Storage
- [ ] Criar tela de login
- [ ] Criar tela de cadastro
- [ ] Implementar proteção de rotas
- [ ] Testar fluxo de autenticação

### ✅ Fase 3: Organizações e Unidades
- [ ] Criar listagem de organizações
- [ ] Criar detalhes de organização
- [ ] Criar listagem de unidades
- [ ] Criar detalhes de unidade
- [ ] Implementar navegação entre org/unit

### ✅ Fase 4: Minha Agenda
- [ ] Criar tela de agenda
- [ ] Implementar listagem de demandas
- [ ] Criar detalhes de demanda
- [ ] Adicionar filtros e ordenação
- [ ] Implementar refresh

### ✅ Fase 5: Recursos Extras
- [ ] Configurar notificações push
- [ ] Adicionar modo escuro
- [ ] Implementar cache offline
- [ ] Adicionar analytics
- [ ] Testes E2E

---

## 11. Dicas e Boas Práticas

### 🎨 Design
- Use React Native Paper para componentes consistentes
- Implemente modo escuro desde o início
- Teste em múltiplos tamanhos de tela

### 🔒 Segurança
- Sempre use Secure Store para tokens
- Nunca armazene senhas no dispositivo
- Implemente refresh token se possível
- Valide dados do usuário

### ⚡ Performance
- Use FlatList para listas grandes
- Implemente paginação
- Use React Query para cache
- Otimize imagens com expo-image

### 🧪 Testes
- Teste em dispositivos reais
- Teste conectividade offline
- Teste diferentes versões do sistema

### 📱 Deploy
- Configure EAS Build para builds nativas
- Use OTA Updates para correções rápidas
- Implemente versionamento semântico

---

## 12. Próximos Passos

1. **Funcionalidades Avançadas**
   - Edição de perfil
   - Upload de avatar
   - Notificações em tempo real (WebSocket)
   - Chat entre membros

2. **Melhorias de UX**
   - Animações suaves
   - Skeleton loading
   - Error boundaries
   - Feedback visual

3. **Integração com Backend**
   - Implementar todos os endpoints
   - Adicionar validações
   - Tratar erros específicos

---

## 📚 Recursos Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/latest)

---

**Criado em:** Novembro 2025  
**Versão:** 1.0.0  
**Autor:** Equipe Ativa Development Team
