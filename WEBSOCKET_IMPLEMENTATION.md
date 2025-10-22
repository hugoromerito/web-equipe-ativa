# 🔌 Sistema de WebSocket - Chamada de Pacientes em Tempo Real

## 📋 Visão Geral

Sistema completo de WebSocket usando **Socket.IO** para atualizações em tempo real quando o status de uma demanda mudar para "em andamento". Quando o médico altera o status, o paciente é automaticamente chamado na TV da recepção.

## 🏗️ Arquitetura

### Componentes Principais

1. **Socket Server** (`src/lib/socket-server.ts`)
   - Inicialização do servidor Socket.IO
   - Gerenciamento de salas por organização
   - Emissão de eventos

2. **Socket Client** (`src/lib/socket-client.ts`)
   - Conexão do cliente com o servidor
   - Gerenciamento de eventos
   - Auto-reconexão

3. **WebSocket Handlers** (`src/lib/websocket-handlers.ts`)
   - Lógica de negócio para eventos
   - Integração com API

4. **Hook useWebSocket** (`src/hooks/use-websocket.ts`)
   - Hook React para facilitar uso
   - Gerenciamento automático de conexão

5. **Página TV Display** (`src/app/(app)/tv-display/page.tsx`)
   - Interface para exibição na TV
   - Atualizações em tempo real

## 🚀 Como Funciona

### Fluxo Completo

```
1. Paciente faz check-in na recepção
2. Médico está pronto para atender
3. Médico altera status da demanda para "em andamento"
4. Backend emite evento via WebSocket
5. TV da recepção recebe o evento
6. Nome do paciente aparece na TV chamando-o
```

### Diagrama de Sequência

```
Médico               Backend              Socket.IO           TV Display
  |                     |                     |                    |
  |--Status: "em andamento"                  |                    |
  |                     |                     |                    |
  |                     |--emit('patient-called')                  |
  |                     |                     |                    |
  |                     |                     |----broadcast------>|
  |                     |                     |                    |
  |                     |                     |          Exibe paciente
```

## 📦 Instalação

As dependências já foram instaladas:

```bash
npm install socket.io socket.io-client
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione ao seu `.env.local`:

```env
# URL do WebSocket (opcional, padrão é a mesma origem)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# URL da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Inicializar Socket.IO no Server

O Socket.IO é inicializado automaticamente através do endpoint `/api/socket`.

## 💻 Uso no Backend

### Emitir Evento de Chamada de Paciente

Quando o status de uma demanda mudar para "em andamento":

```typescript
import { emitPatientCall } from '@/lib/socket-server';

// No seu endpoint de atualização de demanda
export async function PATCH(request: Request) {
  const { status, organizationId, patientName, doctorName, room } = await request.json();
  
  // Atualiza no banco de dados
  const updatedDemand = await updateDemand(demandId, { status });
  
  // Se mudou para "em andamento", chama o paciente
  if (status === 'in_progress' || status === 'em_andamento') {
    emitPatientCall(organizationId, {
      id: updatedDemand.patientId,
      name: patientName,
      demandId: updatedDemand.id,
      doctorName: doctorName,
      room: room || 'Consultório 1',
      timestamp: new Date().toISOString(),
    });
  }
  
  return Response.json({ success: true });
}
```

### Exemplo Completo de Integração

```typescript
// src/app/api/demands/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { emitPatientCall, emitDemandStatusUpdate } from '@/lib/socket-server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, organizationId } = body;

    // 1. Atualiza no banco de dados
    const updatedDemand = await prisma.demand.update({
      where: { id: params.id },
      data: { status },
      include: {
        patient: true,
        doctor: true,
      },
    });

    // 2. Se status é "em andamento", chama o paciente
    if (status === 'in_progress') {
      emitPatientCall(organizationId, {
        id: updatedDemand.patient.id,
        name: updatedDemand.patient.name,
        demandId: updatedDemand.id,
        doctorName: updatedDemand.doctor?.name,
        room: updatedDemand.room,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Emite atualização geral de status
    emitDemandStatusUpdate(organizationId, {
      id: updatedDemand.id,
      status: updatedDemand.status,
      patientName: updatedDemand.patient.name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      demand: updatedDemand,
    });
  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { error: 'Failed to update demand' },
      { status: 500 }
    );
  }
}
```

## 🎨 Uso no Frontend

### 1. Hook useWebSocket

Forma mais simples de usar WebSocket em qualquer componente:

```typescript
'use client';

import { useWebSocket } from '@/hooks/use-websocket';
import { useState } from 'react';

export function MyComponent() {
  const [patients, setPatients] = useState([]);
  
  const { isConnected } = useWebSocket({
    organizationId: 'org-123',
    onPatientCalled: (data) => {
      console.log('Paciente chamado:', data);
      setPatients(prev => [...prev, data]);
      
      // Toca som, mostra notificação, etc
    },
    onDemandStatusUpdate: (data) => {
      console.log('Status atualizado:', data);
    },
    enabled: true, // Pode desabilitar quando necessário
  });
  
  return (
    <div>
      <p>Status: {isConnected() ? 'Conectado' : 'Desconectado'}</p>
      {/* Seu componente */}
    </div>
  );
}
```

### 2. Uso Direto (sem hook)

```typescript
'use client';

import { useEffect } from 'react';
import { 
  getSocket, 
  joinOrganization, 
  onPatientCalled 
} from '@/lib/socket-client';

export function MyComponent() {
  useEffect(() => {
    const socket = getSocket();
    
    // Conecta e entra na sala da organização
    socket.on('connect', () => {
      joinOrganization('org-123');
    });
    
    // Listener de eventos
    const cleanup = onPatientCalled((data) => {
      console.log('Paciente chamado:', data);
    });
    
    return cleanup;
  }, []);
  
  return <div>My Component</div>;
}
```

## 📺 Página TV Display

### Como Usar

1. **Abrir em um navegador na TV:**
   ```
   http://seu-dominio.com/tv-display
   ```

2. **Ou usar o componente de atalho:**
   ```typescript
   import { TVDisplayShortcut } from '@/components/tv-display-shortcut';
   
   // No seu dashboard
   <TVDisplayShortcut />
   ```

3. **Modo Fullscreen:**
   - Pressione F11 no navegador
   - Ou use o botão de fullscreen na página

### Recursos da Página TV Display

- ✅ Atualização em tempo real via WebSocket
- ✅ Destaque visual para o paciente sendo chamado
- ✅ Lista das últimas 10 chamadas
- ✅ Som de notificação (opcional)
- ✅ Indicador de conexão
- ✅ Design responsivo e profissional
- ✅ Animações suaves
- ✅ Suporte a múltiplas organizações

## 🎵 Som de Notificação (Opcional)

Para adicionar som quando um paciente é chamado:

1. **Adicione um arquivo de áudio:**
   ```
   public/sounds/call-notification.mp3
   ```

2. **O som tocará automaticamente** quando um paciente for chamado
   - Volume pré-configurado: 50%
   - Duração: ~2-3 segundos recomendado

## 🔐 Segurança

### Salas por Organização

O sistema usa salas separadas por organização:

```typescript
// Cliente se junta à sala
socket.emit('join-organization', 'org-123');

// Servidor emite apenas para aquela sala
io.to('org-org-123').emit('patient-called', data);
```

### Autenticação

Para adicionar autenticação ao WebSocket:

```typescript
// Em socket-server.ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
```

```typescript
// Em socket-client.ts
const socket = io(socketUrl, {
  auth: {
    token: 'seu-jwt-token',
  },
});
```

## 🐛 Debugging

### Logs do Servidor

O servidor já imprime logs úteis:

```
Client connected: abc123
Socket abc123 joined organization org-123
Patient called emitted to org-org-123: { name: "João Silva", ... }
Client disconnected: abc123
```

### Logs do Cliente

Para ver logs no navegador:

```typescript
// Abra o console do navegador (F12)
// Você verá:
Socket connected: abc123
WebSocket conectado
Paciente chamado: { name: "João Silva", ... }
```

### Verificar Conexão

Na página TV Display, há um indicador visual:
- 🟢 **Verde pulsando** = Conectado
- 🔴 **Vermelho** = Desconectado

## ⚡ Performance

### Otimizações Implementadas

1. **Auto-reconexão:** Cliente reconecta automaticamente se perder conexão
2. **Debounce:** Limita número de eventos processados
3. **Cleanup:** Remove listeners ao desmontar componentes
4. **Polling fallback:** Se WebSocket falhar, usa polling
5. **Lazy loading:** Socket só é criado quando necessário

### Limites

- **Pacientes na tela:** Últimos 10 chamadas
- **Tempo de destaque:** 15 segundos por paciente
- **Reconexão:** Máximo 5 tentativas com backoff exponencial

## 🔄 Comparação: Polling vs WebSocket

### Polling (Sistema Antigo)
```typescript
// Atualiza a cada 5 segundos
useEffect(() => {
  const interval = setInterval(() => {
    fetch('/api/recent-calls');
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

❌ Atraso de até 5 segundos
❌ Muitas requisições desnecessárias
❌ Consome mais recursos

### WebSocket (Sistema Novo)
```typescript
useWebSocket({
  organizationId,
  onPatientCalled: (data) => {
    // Recebe instantaneamente!
  },
});
```

✅ Atualização instantânea (< 100ms)
✅ Apenas 1 conexão persistente
✅ Muito mais eficiente

## 📊 Eventos Disponíveis

### 1. `patient-called`

Emitido quando um paciente é chamado:

```typescript
{
  id: string;           // ID do paciente
  name: string;         // Nome do paciente
  demandId: string;     // ID da demanda
  doctorName?: string;  // Nome do médico
  room?: string;        // Sala/consultório
  timestamp: string;    // ISO timestamp
}
```

### 2. `demand-status-updated`

Emitido quando qualquer status muda:

```typescript
{
  id: string;           // ID da demanda
  status: string;       // Novo status
  patientName?: string; // Nome do paciente
  timestamp: string;    // ISO timestamp
}
```

## 🚨 Troubleshooting

### WebSocket não conecta

1. **Verifique se o servidor está rodando:**
   ```bash
   npm run dev
   ```

2. **Verifique as variáveis de ambiente:**
   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

3. **Abra o console do navegador** e procure por erros

### Eventos não são recebidos

1. **Verifique se está na sala correta:**
   ```typescript
   joinOrganization('org-id-correto');
   ```

2. **Confirme que o backend está emitindo:**
   ```typescript
   console.log('Emitindo evento...');
   emitPatientCall(organizationId, data);
   ```

3. **Verifique os listeners:**
   ```typescript
   const cleanup = onPatientCalled((data) => {
     console.log('Recebido!', data);
   });
   ```

### Problemas de CORS

Se houver erro de CORS, configure em `socket-server.ts`:

```typescript
cors: {
  origin: [
    'http://localhost:3000',
    'https://seu-dominio.com',
  ],
  methods: ['GET', 'POST'],
  credentials: true,
}
```

## 📚 Próximos Passos

### Melhorias Sugeridas

1. **Autenticação JWT** no WebSocket
2. **Notificações push** para mobile
3. **Histórico de chamadas** persistente
4. **Dashboard de monitoramento** em tempo real
5. **Testes automatizados** para WebSocket
6. **Rate limiting** para evitar spam
7. **Compressão de mensagens** para performance
8. **Heartbeat/ping-pong** para detecção de conexão

### Integração com Outros Sistemas

- **SMS:** Enviar SMS quando paciente é chamado
- **App Mobile:** Notificação push no app do paciente
- **Totem:** Display em totens de autoatendimento
- **Relatórios:** Tempo médio de espera, estatísticas

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique os logs do console
2. Consulte esta documentação
3. Entre em contato com a equipe de desenvolvimento

---

## 🎯 Resumo Rápido

### Backend
```typescript
// Quando status mudar para "em andamento"
emitPatientCall(organizationId, {
  name: patientName,
  // ... outros dados
});
```

### Frontend
```typescript
// No componente da TV
useWebSocket({
  organizationId,
  onPatientCalled: (data) => {
    // Mostra na tela!
  },
});
```

### Acessar TV Display
```
http://seu-dominio.com/tv-display
```

---

**Sistema implementado com sucesso! ✅**
