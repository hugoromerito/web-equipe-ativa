# Correções Aplicadas - Adaptação para Backend

## ✅ Correções Implementadas

### 1. **Arquivo `.env`** ❌ PRECISA SER CORRIGIDO MANUALMENTE
**Localização**: `/workspaces/web-equipe-ativa/.env`

**Atual (INCORRETO)**:
```env
NEXT_PUBLIC_API_URL=https://equipe-ativa-1498a5a916b7.herokuapp.com//health
```

**Deve ser alterado para**:
```env
NEXT_PUBLIC_API_URL=https://equipe-ativa-1498a5a916b7.herokuapp.com
```

**Problema**: 
- Barra dupla (`//`) causa URLs malformadas
- `/health` no final não deve estar na URL base

---

### 2. **Interface GetMembershipResponse** ✅ CORRIGIDO
**Arquivo**: `src/http/get-membership.ts`

**Mudança**:
```typescript
// ANTES (Frontend usando nomes incorretos)
interface GetMembershipResponse {
  membership: {
    id: string
    orgRole: Role,      // ❌ Backend não usa esse nome
    unitRole: Role,     // ❌ Backend não usa esse nome
    organizationId: string
    userId: string
  }
}

// DEPOIS (Adaptado para backend)
interface GetMembershipResponse {
  membership: {
    id: string
    organization_role: Role  // ✅ Nome correto do backend
    unit_role?: Role         // ✅ Nome correto do backend (opcional)
    organizationId: string
    userId: string
  }
}
```

---

### 3. **Função ability()** ✅ CORRIGIDO
**Arquivo**: `src/lib/auth.ts`

**Mudança**:
```typescript
// ANTES
export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  // Verificava campos incorretos
  if (!membership.orgRole || !membership.unitRole) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    orgRole: membership.orgRole,      // ❌ Campo não existe no backend
    unitRole: membership.unitRole,    // ❌ Campo não existe no backend
  })

  return ability
}

// DEPOIS
export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  // Verifica apenas organization_role (obrigatório)
  if (!membership.organization_role) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    orgRole: membership.organization_role,  // ✅ Mapeia corretamente
    unitRole: membership.unit_role,         // ✅ Mapeia corretamente (opcional)
  })

  return ability
}
```

**Por que essa mudança é importante**:
- O backend retorna `organization_role` e `unit_role`
- O frontend esperava `orgRole` e `unitRole`
- Sem essa correção, o `ability()` sempre retornaria `null`
- Isso impedia o sistema de permissões de funcionar

---

### 4. **Schema do User** ✅ CORRIGIDO
**Arquivo**: `src/lib/auth/models/user.ts`

**Mudança**:
```typescript
// ANTES
export const userSchema = z.object({
  id: z.string(),
  orgRole: roleSchema,
  unitRole: roleSchema,  // ❌ Sempre obrigatório causava erro
})

// DEPOIS
export const userSchema = z.object({
  id: z.string(),
  orgRole: roleSchema,
  unitRole: roleSchema.optional(),  // ✅ Agora é opcional
})
```

**Por que essa mudança é importante**:
- No backend, usuários podem pertencer apenas à organização (sem unidade específica)
- `unit_role` é opcional quando o usuário não está vinculado a uma unidade
- Tornar opcional evita erros de validação do Zod

---

### 5. **Endpoint de Sign-up** ✅ JÁ ESTAVA CORRETO
**Arquivo**: `src/http/sign-up.ts`

O endpoint já estava usando `POST /users` corretamente:
```typescript
export async function signUp({ name, email, password }: SignUpRequest) {
  const result = await api.post('users', {  // ✅ Correto!
    json: { name, email, password },
  })
}
```

---

## 📋 Checklist de Verificação

- [x] Interface de Membership adaptada para backend
- [x] Função ability() corrigida para mapear campos corretos
- [x] Schema User atualizado com unitRole opcional
- [x] Endpoint sign-up verificado (já estava correto)
- [ ] **Arquivo .env precisa ser corrigido manualmente**

---

## 🚀 Próximos Passos

### 1. CORRIGIR .env MANUALMENTE
Edite o arquivo `.env` e remova `//health` da URL:
```env
NEXT_PUBLIC_API_URL=https://equipe-ativa-1498a5a916b7.herokuapp.com
```

### 2. Reiniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 3. Testar funcionalidades
- [ ] Sign-up de novo usuário
- [ ] Login com credenciais
- [ ] Listagem de organizações
- [ ] Membership e permissões
- [ ] Navegação entre páginas protegidas

---

## 🔍 Problemas Resolvidos

### Erro 404 - `/health/users`
**Causa**: URL da API estava com `//health` no final
**Solução**: Remover `//health` e barras duplas da URL base

### `orgRole` undefined
**Causa**: Backend retorna `organization_role` mas frontend esperava `orgRole`
**Solução**: Atualizar interface e mapeamento de campos

### Erro "Permissions for role undefined not found"
**Causa**: 
1. Backend retorna campos com nomes diferentes
2. Frontend não mapeava corretamente os campos
3. `unit_role` não era tratado como opcional
**Solução**: 
1. Atualizar interface com nomes corretos
2. Mapear campos na função ability()
3. Tornar unitRole opcional no schema

---

## 📝 Observações Importantes

### Fluxo de Sign-up Correto
1. Usuário preenche formulário de cadastro
2. Frontend envia `POST /users` (NÃO `/auth/sign-up`)
3. Backend cria usuário mas **NÃO retorna token**
4. Frontend deve redirecionar para login
5. Usuário faz login e recebe token
6. Com token, usuário pode acessar o sistema

### Membership
- Todo usuário **DEVE** pertencer a uma organização para acessar o sistema
- `organization_role` é **obrigatório**
- `unit_role` é **opcional** (só para usuários vinculados a unidades)

### Roles Disponíveis
- `ADMIN` - Administrador da organização
- `MANAGER` - Gestor (cria demandas, gerencia usuários)
- `CLERK` - Atendente (cria demandas e applicants)
- `ANALYST` - Analista (atualiza status de demandas)
- `BILLING` - Financeiro (gerencia billing)
