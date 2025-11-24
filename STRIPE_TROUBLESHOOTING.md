# 🔧 Troubleshooting - Sistema de Pagamentos

## Erro: Backend Indisponível (503) ou CORS

### Causa
Os erros mais comuns são:
- `GET https://api.equipeativa.com/plans net::ERR_FAILED 503` - Backend offline
- `blocked by CORS policy` - Backend não permite requisições do localhost

### Soluções Rápidas

#### ✅ Solução 1: Modo de Demonstração (Recomendado para Desenvolvimento)

O sistema **automaticamente usa dados mockados** quando detecta erro de conexão ou CORS em desenvolvimento.

**Você verá:**
- ✅ 3 planos de exemplo (Básico, Profissional, Empresarial)
- ✅ Interface totalmente funcional
- ✅ Todos os componentes visuais
- ℹ️ Alerta informando que é modo demo

**Limitações:**
- ❌ Não cria assinaturas reais
- ❌ Não processa pagamentos
- ✅ Perfeito para testar UI/UX

#### ✅ Solução 2: Configurar CORS no Backend

**No backend, configure CORS para permitir localhost:**

```typescript
// backend/src/http/server.ts
import fastifyCors from '@fastify/cors'

app.register(fastifyCors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://equipeativa.com',
    'https://www.equipeativa.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
})
```

**Para desenvolvimento (APENAS LOCAL):**
```typescript
app.register(fastifyCors, {
  origin: true,  // Permite todas as origens
  credentials: true,
})
```

⚠️ **IMPORTANTE:** Nunca use `origin: true` em produção!

#### 1. Verificar se o Backend está Rodando

```bash
# Verifique se o backend está online
curl https://api.equipeativa.com/health

# Ou teste localmente
curl http://localhost:3333/health
```

#### 2. Usar Backend Local

Se estiver desenvolvendo localmente, altere a URL da API no `.env.local`:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Certifique-se de que o backend está rodando:

```bash
cd ../backend
npm run dev
```

#### 3. Modo de Desenvolvimento (Dados Mockados)

O sistema agora inclui dados mockados para desenvolvimento. Quando o backend está indisponível em `NODE_ENV=development`, a aplicação usa dados de exemplo automaticamente.

**Dados mockados incluem:**
- 3 planos (Básico, Profissional, Empresarial)
- Preços de exemplo
- Recursos e limites

**Limitações do modo mockado:**
- ❌ Não é possível criar assinaturas reais
- ❌ Não é possível processar pagamentos
- ❌ Não há persistência de dados
- ✅ Permite visualizar a interface
- ✅ Permite testar componentes visuais

#### 4. Verificar Configuração do Backend

Certifique-se de que as rotas de billing estão configuradas no backend:

```typescript
// backend/src/http/routes/billing.ts
app.get('/plans', async (request, reply) => {
  // Implementação
})
```

#### 5. Verificar CORS

Se o backend está rodando mas retorna erro 503, pode ser problema de CORS:

```typescript
// backend/src/http/server.ts
app.register(fastifyCors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://seu-dominio.com'
  ],
  credentials: true,
})
```

#### 6. Verificar Migrations

Certifique-se de que as migrations de billing foram executadas:

```bash
cd backend
npm run db:migrate
```

Verifique se as tabelas foram criadas:
- `plans`
- `subscriptions`
- `payments`
- `payment_methods`
- `usage_records`

#### 7. Popular Dados Iniciais

Se as tabelas estão vazias, popule com dados iniciais:

```sql
-- Exemplo de inserção de plano
INSERT INTO plans (
  id, name, description, 
  price_monthly, price_yearly, currency,
  max_members, max_units, max_demands, max_storage_gb,
  features, is_popular, trial_days
) VALUES (
  gen_random_uuid(),
  'Plano Básico',
  'Para pequenas equipes',
  29.90, 299.00, 'brl',
  10, 2, 50, 5,
  ARRAY['Suporte por email', 'Dashboard básico'],
  false, 14
);
```

Ou use seeds:

```bash
npm run db:seed
```

## Checklist de Diagnóstico

- [ ] Backend está rodando?
- [ ] URL da API está correta no `.env.local`?
- [ ] Migrations foram executadas?
- [ ] Tabelas de billing existem no banco?
- [ ] CORS está configurado corretamente?
- [ ] Há planos cadastrados no banco?
- [ ] Stripe está configurado no backend?

## Logs Úteis

### Frontend
Abra o Console do navegador (F12) e procure por:
```
❌ API Error: {status: 503, url: "..."}
⚠️ Backend indisponível - usando dados mockados
```

### Backend
Verifique os logs do servidor:
```bash
# Logs do backend
tail -f backend/logs/server.log

# Ou no console onde está rodando
npm run dev
```

## Soluções Rápidas

### Problema: "Cannot connect to backend"
```bash
# Solução 1: Reiniciar backend
cd backend
npm run dev

# Solução 2: Usar mock data (desenvolvimento)
# Já configurado automaticamente quando backend está offline
```

### Problema: "Plans table does not exist"
```bash
# Solução: Executar migrations
cd backend
npm run db:migrate
npm run db:seed  # opcional: popular dados
```

### Problema: "CORS error"
```typescript
// backend/src/http/server.ts
app.register(fastifyCors, {
  origin: true,  // Permitir todas origens (apenas dev!)
  credentials: true,
})
```

### Problema: "Authentication failed"
```bash
# Verificar se está autenticado
# Token deve estar nos cookies
# Fazer login novamente se necessário
```

## Modo de Produção

Em produção, o backend **DEVE** estar disponível. Os dados mockados **NÃO** são usados em produção.

### Verificar Saúde do Backend em Produção

```bash
# Health check
curl https://api.equipeativa.com/health

# Test plans endpoint
curl https://api.equipeativa.com/plans \
  -H "Authorization: Bearer seu_token"
```

### Monitoramento

Configure alertas para:
- Disponibilidade do backend (uptime)
- Latência das APIs
- Taxa de erros 5xx
- Uso de recursos

### Logs em Produção

Use serviços como:
- Sentry para erros
- DataDog para métricas
- CloudWatch para logs AWS
- LogRocket para sessões de usuário

## Contato de Suporte

Se o problema persistir:

1. Verifique o status do serviço
2. Consulte logs do backend
3. Verifique configurações de rede/firewall
4. Entre em contato com a equipe de infraestrutura

## Debug Avançado

### Interceptar Requisições

```typescript
// Adicionar no api-client.ts
hooks: {
  beforeRequest: [
    async (request) => {
      console.log('📤 Request:', {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries())
      })
    }
  ],
  afterResponse: [
    async (request, options, response) => {
      console.log('📥 Response:', {
        url: request.url,
        status: response.status,
        ok: response.ok
      })
      return response
    }
  ]
}
```

### Testar Endpoint Diretamente

```bash
# Com curl
curl -v https://api.equipeativa.com/plans

# Com httpie
http https://api.equipeativa.com/plans

# Com Postman
# Importar coleção e testar
```

### Verificar Conectividade

```bash
# Ping do servidor
ping api.equipeativa.com

# Traceroute
tracert api.equipeativa.com  # Windows
traceroute api.equipeativa.com  # Linux/Mac

# DNS lookup
nslookup api.equipeativa.com
```

---

**Última atualização:** 23 de novembro de 2025
