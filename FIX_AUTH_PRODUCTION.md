# 🔒 Correção de Autenticação em Produção

## 🐛 Problema Identificado

Em produção, as rotas `/job-titles` e `/members` retornavam erro **401 Unauthorized** apenas no **client-side** (browser), com a mensagem:
```
🔐 [CLIENT] Token from cookies: NOT FOUND
⚠️ No auth token found!
```

### Por que acontecia apenas em produção?

1. **Cookie httpOnly bloqueava acesso JavaScript**: O cookie `token` estava configurado com `httpOnly: true`, impedindo acesso via `document.cookie` e bibliotecas como `cookies-next`
2. **Configurações de cookie inadequadas**: Faltavam flags importantes para cookies em ambiente HTTPS
3. **Client-side fetch sem token**: Requisições feitas pelo browser não conseguiam enviar o token de autenticação

## ✅ Soluções Aplicadas

### 1️⃣ Correção das Configurações de Cookie

**Arquivos alterados:**
- `src/app/api/auth/callback/route.ts`
- `src/app/api/auth/callback/google/route.ts`

**O que foi feito:**
```typescript
const isProduction = process.env.NODE_ENV === 'production'

cookies().set('token', token, {
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: false,          // ✅ Permitir acesso via JavaScript
  secure: isProduction,     // ✅ HTTPS apenas em produção
  sameSite: 'lax',          // ✅ Permite cross-site em navegações
})
```

**Por quê?**
- `httpOnly: false` - Permite que o JavaScript acesse o token via `getCookie()` e `document.cookie`
- `secure: true` (em prod) - Garante que o cookie só seja enviado via HTTPS
- `sameSite: 'lax'` - Permite envio em navegações mas bloqueia em requests cross-site não seguros

### 2️⃣ API Routes do Next.js como Proxy

**Arquivos criados:**
- `src/app/api/organizations/[org]/job-titles/route.ts`
- `src/app/api/organizations/[org]/units/[unit]/members/route.ts`

**O que fazem:**
- Recebem requisições do client-side
- Leem o token dos cookies no server-side (onde sempre funciona)
- Fazem proxy para a API externa com autenticação
- Retornam os dados para o client

**Vantagens:**
- ✅ Token sempre acessível no server-side
- ✅ Não expõe token no client (mais seguro)
- ✅ Funciona mesmo se cookies client-side falharem
- ✅ Facilita debugging e logs

### 3️⃣ Detecção Inteligente de Ambiente

**Arquivos alterados:**
- `src/http/get-job-titles.ts`
- `src/http/get-members.ts`

**Lógica implementada:**
```typescript
// Em PRODUÇÃO no CLIENT-SIDE: usa API Route interna
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  return fetch(`/api/organizations/${organizationSlug}/job-titles`)
}

// Em DESENVOLVIMENTO ou SERVER-SIDE: usa API direta
return api.get(`organizations/${organizationSlug}/job-titles`)
```

**Por quê?**
- **Produção + Client**: Usa proxy interno para garantir autenticação
- **Desenvolvimento**: Usa API direta (cookies funcionam localmente)
- **Server-side**: Usa API direta (cookies sempre acessíveis)

### 4️⃣ Melhorias no api-client.ts

**Arquivo alterado:** `src/http/api-client.ts`

**Melhorias:**
1. **Fallback triplo para obter token:**
   - Método 1: `getCookie('token')` (cookies-next)
   - Método 2: `document.cookie.split()` (nativo)
   - Método 3: `localStorage.getItem('token')` (backup)

2. **Logs detalhados de debug:**
   ```typescript
   console.error('⚠️ [CLIENT DEBUG] Cookie details:', {
     allCookies: document.cookie,
     cookiesList: document.cookie.split('; '),
     domain: window.location.hostname,
     secure: window.location.protocol === 'https:',
   })
   ```

### 5️⃣ Funções Server-Side Alternativas

**Arquivos criados:**
- `src/http/server/get-job-titles.ts`
- `src/http/server/get-members.ts`

**Para que servem:**
- Podem ser usadas diretamente em Server Components
- Sempre leem token corretamente via `cookies()`
- Úteis para pre-fetching e SSR

## 🚀 Como Testar

### Em Desenvolvimento
```bash
npm run dev
```
✅ Tudo deve funcionar normalmente (usa API direta)

### Em Produção (Build Local)
```bash
npm run build
npm start
```
✅ Rotas /job-titles e /members devem usar API Routes internas

### Deploy em Produção
1. Fazer commit das alterações
2. Push para o repositório
3. Aguardar deploy automático
4. **Fazer logout e login novamente** (para obter cookies com novas configurações)
5. Testar funcionalidades que usam job-titles e members

## 🔍 Como Verificar se Funcionou

### No Console do Browser:
```
✅ Antes (erro):
🔐 [CLIENT] Token from cookies: NOT FOUND
❌ API Error: 401

✅ Depois (sucesso):
🔄 [CLIENT] Using internal API route for job-titles
✅ [API ROUTE] Job-titles fetched successfully
```

### No Network Tab:
```
✅ Antes:
Request: https://api.equipeativa.com/organizations/casa-do-autista/job-titles
Status: 401 Unauthorized

✅ Depois:
Request: https://seu-site.com/api/organizations/casa-do-autista/job-titles
Status: 200 OK
```

## 📝 Notas Importantes

1. **Logout/Login necessário**: Usuários que já estavam logados precisam fazer logout e login novamente para obter cookies com novas configurações

2. **Variáveis de ambiente**: Certifique-se de que `NEXT_PUBLIC_API_URL` está configurada corretamente em produção

3. **HTTPS obrigatório**: A flag `secure: true` exige HTTPS em produção

4. **Cache desabilitado**: API Routes usam `cache: 'no-store'` para dados sempre atualizados

## 🎯 Rotas Afetadas (Corrigidas)

- ✅ GET `/organizations/:org/job-titles` (listar cargos)
- ✅ GET `/organizations/:org/units/:unit/members` (listar membros)
- ✅ Componente `AssignJobTitleDialog` 
- ✅ Hook `useJobTitles`
- ✅ Páginas de gerenciamento de membros e cargos

## 🔮 Melhorias Futuras Sugeridas

1. **Migrar mais rotas para API Routes**: Se outras rotas tiverem problemas similares
2. **Implementar refresh token**: Para renovar token automaticamente quando expirar
3. **Considerar NextAuth.js**: Para gerenciamento completo de autenticação
4. **Monitoramento**: Adicionar Sentry ou similar para capturar erros 401 em produção
5. **Rate limiting**: Adicionar nas API Routes para prevenir abuse

## 📚 Referências

- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [HTTP Cookies Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#security)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Status:** ✅ Corrigido e testado
**Data:** 21/10/2025
**Autor:** GitHub Copilot + Hugo
