# Adaptação Frontend para Backend

## Problemas Identificados

### 1. URL da API incorreta no `.env`
- **Problema**: URL com barras duplas e `/health` no final
- **Atual**: `https://equipe-ativa-1498a5a916b7.herokuapp.com//health`
- **Correto**: `https://equipe-ativa-1498a5a916b7.herokuapp.com`

### 2. Endpoint de Sign-up incorreto
- **Problema**: Frontend tenta `POST /auth/sign-up` mas backend não tem essa rota
- **Backend real**: `POST /users`
- **Arquivo**: `src/http/sign-up.ts`

### 3. Estrutura de Response do Sign-up
- **Backend retorna**:
```typescript
{
  message: 'Usuário criado com sucesso.',
  user: {
    id: string,
    name: string,
    email: string
  }
}
```
- **Backend NÃO retorna token** - necessário fazer login após registro

### 4. Estrutura de Membership
- **Backend usa**:
  - `organization_role` (ao invés de `orgRole`)
  - `unit_role` (ao invés de `unitRole`)
- **Arquivos afetados**: 
  - `src/http/get-membership.ts`
  - `src/lib/auth.ts`

### 5. Endpoints de Autenticação
- **Login**: `POST /sessions/password` ✅ (correto)
- **Google OAuth**: `POST /sessions/google` ✅ (correto)
- **Profile**: `GET /profile` ✅ (correto)
- **Sign-up**: `POST /users` ❌ (precisa corrigir)

## Estrutura Completa da API

### Autenticação
- `POST /sessions/password` - Login com email/senha
- `POST /sessions/google` - Login com Google OAuth
- `GET /profile` - Obter perfil do usuário autenticado
- `POST /users` - Criar novo usuário (sign-up)
- `POST /password/recover` - Solicitar recuperação de senha
- `POST /password/reset` - Resetar senha

### Organizações
- `GET /organizations` - Listar organizações do usuário
- `POST /organizations` - Criar organização
- `GET /organizations/:slug` - Obter detalhes da organização
- `GET /organizations/:slug/membership` - Obter membership do usuário
- `PUT /organizations/:slug` - Atualizar organização
- `DELETE /organizations/:slug` - Encerrar organização

### Unidades
- `GET /organizations/:organizationSlug/units` - Listar unidades
- `POST /organizations/:organizationSlug/units` - Criar unidade

### Membros
- `GET /organizations/:slug/members` - Listar membros da organização
- `GET /organizations/:organizationSlug/units/:unitSlug/members` - Listar membros da unidade

### Usuários
- `GET /organizations/:organizationSlug/users` - Listar usuários da organização
- `POST /users` - Criar usuário

### Convites
- `POST /organizations/:organizationSlug/invites` - Criar convite
- `GET /organizations/:organizationSlug/invites` - Listar convites da organização
- `GET /organizations/:organizationSlug/invites/:inviteId` - Obter convite específico
- `GET /pending-invites` - Listar convites pendentes do usuário
- `GET /invites/pending` - Listar convites pendentes
- `POST /invites/:inviteId/accept` - Aceitar convite
- `POST /invites/:inviteId/reject` - Rejeitar convite

### Applicants (Pacientes)
- `GET /organizations/:organizationSlug/applicants` - Listar applicants
- `POST /organizations/:organizationSlug/applicants` - Criar applicant
- `GET /organizations/:organizationSlug/applicant/:applicantSlug` - Obter applicant
- `GET /organizations/:organizationSlug/applicant?cpf=xxx` - Verificar se applicant existe por CPF

### Demands (Consultas)
- `GET /organizations/:organizationSlug/units/:unitSlug/demands` - Listar consultas
- `POST /organizations/:organizationSlug/units/:unitSlug/applicants/:applicantSlug/demands` - Criar consulta
- `GET /organizations/:organizationSlug/units/:unitSlug/demands/:demandId` - Obter consulta
- `PUT /organizations/:organizationSlug/units/:unitSlug/demands/:demandId` - Atualizar consulta

## Mudanças Necessárias no Frontend

### 1. Arquivo `.env`
```env
# REMOVER "/health" e a barra dupla
NEXT_PUBLIC_API_URL=https://equipe-ativa-1498a5a916b7.herokuapp.com
```

### 2. Criar novo arquivo `src/http/sign-up.ts`
```typescript
import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

interface SignUpResponse {
  message: string
  user: {
    id: string
    name: string
    email: string
  }
}

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest) {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<SignUpResponse>()

  return result
}
```

### 3. Atualizar `src/http/get-membership.ts`
```typescript
interface GetMembershipResponse {
  membership: {
    id: string
    organization_role: Role  // era orgRole
    unit_role?: Role         // era unitRole
    organizationId: string
    userId: string
  }
}
```

### 4. Atualizar `src/lib/auth.ts`
```typescript
export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  // Verificar se organization_role e unit_role existem
  if (!membership.organization_role) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    orgRole: membership.organization_role,  // mapear organization_role para orgRole
    unitRole: membership.unit_role,         // mapear unit_role para unitRole
  })

  return ability
}
```

### 5. Atualizar action de Sign-up em `src/app/auth/actions.tsx`
- Usar o novo endpoint `POST /users`
- Não esperar token na resposta
- Redirecionar para login após sucesso

## Roles no Backend

```typescript
type Role = 'ADMIN' | 'MANAGER' | 'CLERK' | 'ANALYST' | 'BILLING'
```

### Permissões por Role:
- **ADMIN**: Gerencia tudo na organização
- **MANAGER**: Cria consultas, applicants, gerencia usuários
- **CLERK**: Cria consultas e applicants, visualiza próprias consultas
- **ANALYST**: Visualiza e atualiza consultas
- **BILLING**: Gerencia billing (financeiro)

## Observações Importantes

1. **Autenticação**: O backend usa Bearer token no header `Authorization`
2. **Cookies**: O sistema usa cookies para armazenar: `token`, `org`, `unit`, `applicant`, `demand`, `inviteId`
3. **Sem token no sign-up**: Usuário deve fazer login após se registrar
4. **Membership obrigatório**: Usuário precisa pertencer a uma organização para acessar a maioria das rotas
5. **Unit opcional**: Algumas rotas funcionam apenas com organização, outras precisam de unidade específica
