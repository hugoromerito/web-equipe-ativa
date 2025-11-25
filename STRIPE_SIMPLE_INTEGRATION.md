# Integração Simplificada com Stripe

## ✅ Implementação Completa

Sistema de checkout Stripe totalmente funcional usando a nova API simplificada do backend.

## 🎯 O que foi implementado

### 1. **API Client** (`src/http/stripe-simple.ts`)

Cliente HTTP simplificado para comunicação com o backend Stripe:

```typescript
// Funções principais
- getStripeProducts()         // Lista produtos/planos disponíveis
- createStripeCheckout()      // Cria sessão de checkout
- getStripeCheckoutSession()  // Verifica status do checkout
- getStripeSubscriptions()    // Lista assinaturas do cliente
- createCustomerPortal()      // Abre portal de gerenciamento
```

**Tipos exportados:**
- `StripeProduct` - Produto com lista de preços
- `StripePrice` - Informações de preço (mensal/anual)
- `StripeSubscription` - Assinatura ativa do cliente
- `StripeCheckoutRequest` - Parâmetros para criar checkout
- `CustomerPortalRequest` - Parâmetros para abrir portal

### 2. **React Query Hooks** (`src/hooks/use-stripe-simple.ts`)

Hooks otimizados com cache e gerenciamento de estado:

```typescript
// Queries (GET)
useStripeProducts()              // Lista produtos
useStripeSubscriptions(email)    // Lista assinaturas

// Mutations (POST)
useCreateStripeCheckout()        // Cria checkout + redirect
useCustomerPortal()              // Abre portal + redirect
```

**Configuração anti-loop:**
- `staleTime: 5 * 60 * 1000` - Cache de 5 minutos
- `refetchOnWindowFocus: false` - Não recarrega ao focar janela
- `refetchOnMount: false` - Não recarrega ao montar componente
- `refetchOnReconnect: false` - Não recarrega ao reconectar

### 3. **Página de Assinatura** (`src/app/(app)/org/[org]/subscription/page.tsx`)

Interface limpa e moderna para seleção de planos:

**Recursos:**
- ✅ Lista produtos direto do Stripe
- ✅ Exibe assinatura atual (se existir)
- ✅ Botão "Gerenciar Assinatura" → Stripe Customer Portal
- ✅ Grid responsivo de planos (3 colunas)
- ✅ Formatação de moeda (R$ xx,xx)
- ✅ Loading states
- ✅ Error handling
- ✅ Dark mode support

**Fluxo:**
1. Usuário vê planos disponíveis
2. Clica em "Selecionar Plano"
3. Sistema valida email e organização
4. Cria checkout session no backend
5. Redireciona para Stripe Hosted Checkout
6. Stripe processa pagamento
7. Retorna para success page

### 4. **Página de Sucesso** (`src/app/(app)/org/[org]/subscription/success/page.tsx`)

Confirmação de pagamento pós-checkout:

**Recursos:**
- ✅ Valida sessão de checkout via `session_id`
- ✅ Exibe detalhes do pagamento
- ✅ Loading state com spinner
- ✅ Error handling com fallback
- ✅ Botões para voltar à assinatura ou dashboard
- ✅ Aguarda webhook processar (2 segundos)

### 5. **Página de Cancelamento** (`src/app/(app)/org/[org]/subscription/cancel/page.tsx`)

Mensagem amigável para checkout cancelado:

**Recursos:**
- ✅ Ícone de cancelamento
- ✅ Mensagem de reassurance
- ✅ Botões para tentar novamente ou voltar

## 🔗 URLs e Rotas

### Frontend
```
/org/[slug]/subscription              → Página principal
/org/[slug]/subscription/success      → Confirmação de pagamento
/org/[slug]/subscription/cancel       → Checkout cancelado
```

### Backend API
```
GET  /stripe/products                 → Lista produtos
POST /stripe/checkout                 → Cria checkout session
GET  /stripe/checkout/{sessionId}     → Verifica sessão
GET  /stripe/subscriptions            → Lista assinaturas (customerEmail)
POST /stripe/customer-portal          → Abre Customer Portal
```

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário acessa /org/[slug]/subscription                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. useStripeProducts() busca planos do Stripe               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. useStripeSubscriptions(email) busca assinaturas          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Exibe grid de planos + assinatura atual (se houver)      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Usuário clica "Selecionar Plano"                         │
│    - Valida email do cookie                                 │
│    - Valida slug da organização                             │
│    - Chama createStripeCheckout()                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Backend cria Checkout Session no Stripe                  │
│    Parâmetros:                                               │
│    - priceId                                                 │
│    - customerEmail                                           │
│    - successUrl (com {CHECKOUT_SESSION_ID})                 │
│    - cancelUrl                                               │
│    - metadata (organizationId)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Backend retorna { sessionId, url }                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. onSuccess redirect: window.location.href = url           │
│    → Stripe Hosted Checkout                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Usuário preenche dados de pagamento no Stripe            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Stripe processa pagamento                                │
│     - Sucesso → redirect successUrl                          │
│     - Falha   → redirect cancelUrl                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. Success page valida session_id                          │
│     - getStripeCheckoutSession(sessionId)                   │
│     - Exibe detalhes do pagamento                           │
│     - Aguarda webhook processar assinatura                  │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Design e UI

### Página Principal
- **Layout:** Grid responsivo 3 colunas (desktop), stack (mobile)
- **Card de Assinatura Atual:** Border azul, badge de status
- **Cards de Planos:** Título, descrição, preço formatado, botão
- **Loading:** Mensagem centralizada "Carregando planos..."
- **Error:** Card vermelho com mensagem de erro

### Cores
- **Sucesso:** Verde (`bg-green-100`, `text-green-600`)
- **Erro:** Vermelho (`border-red-500`, `text-red-600`)
- **Cancelamento:** Amarelo (`bg-yellow-100`, `text-yellow-600`)
- **Assinatura Atual:** Azul (`border-blue-500`)
- **Background:** Gradiente cinza (`from-gray-50 to-gray-100`)

### Dark Mode
- ✅ Suporte completo com classes `dark:`
- ✅ Gradiente escuro: `dark:from-gray-900 dark:to-gray-800`
- ✅ Textos: `dark:text-white`, `dark:text-gray-400`

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 2. Cookie do Usuário
O sistema espera que o email do usuário esteja em um cookie:

```typescript
const userEmail = getCookie('userEmail') as string | undefined
```

**Importante:** Você precisa garantir que o email seja salvo no cookie após o login.

### 3. Backend Endpoints
Certifique-se que o backend expõe:
- `GET /stripe/products`
- `POST /stripe/checkout`
- `GET /stripe/checkout/:sessionId`
- `GET /stripe/subscriptions?customerEmail=...`
- `POST /stripe/customer-portal`

## 🎯 Próximos Passos

### Opcionais
1. **Adicionar Customer Portal inline** - Exibir faturas e métodos de pagamento na própria aplicação
2. **Sistema de cupons** - Adicionar campo para código promocional
3. **Upgrade/Downgrade** - Permitir trocar de plano com proration
4. **Webhooks Frontend** - Atualizar UI em tempo real via WebSocket quando assinatura mudar
5. **Analytics** - Tracking de conversão de planos
6. **Trial period** - Adicionar período de teste gratuito

### Melhorias de UX
- [ ] Adicionar comparativo de planos (tabela)
- [ ] Animações de transição entre states
- [ ] Feedback visual ao selecionar plano
- [ ] Tooltip explicando cada feature do plano
- [ ] Banner com ofertas especiais

## 📝 Notas Importantes

### Simplificação vs Sistema Antigo
**Removido:**
- ❌ Tabela `Plans` customizada
- ❌ Tabela `Subscriptions` customizada
- ❌ Tabela `PaymentMethods` customizada
- ❌ Conversão slug → UUID
- ❌ Complexidade de gerenciamento de estado

**Adicionado:**
- ✅ Uso direto da API Stripe
- ✅ Stripe Hosted Checkout (PCI compliant)
- ✅ Stripe Customer Portal (self-service)
- ✅ Menos código, mais confiável

### Vantagens
- **Segurança:** PCI DSS compliant (Stripe gerencia dados sensíveis)
- **Manutenção:** Stripe gerencia UI de pagamento
- **Features:** Auto-upgrade, invoicing, receipts, etc.
- **Internacionalização:** Stripe suporta múltiplas moedas
- **Compliance:** GDPR, SOC 2, etc.

### Limitações
- Não é possível customizar 100% a UI de checkout
- Dependência do Stripe (vendor lock-in)
- Customer Portal em inglês (pode configurar locale)

## 🐛 Troubleshooting

### Problema: "Email do usuário não encontrado"
**Solução:** Verifique se o cookie `userEmail` está sendo salvo corretamente após login.

### Problema: Infinite loop de requests
**Solução:** Já resolvido! Configurações de React Query impedem refetch automático.

### Problema: Backend retorna 404 em /stripe/*
**Solução:** Certifique-se que o backend está usando a nova API simplificada.

### Problema: Checkout não redireciona
**Solução:** Verifique se `onSuccess` da mutation está sendo chamado e se `window.location.href` funciona.

### Problema: Success page não valida sessão
**Solução:** Verifique se o `session_id` está na URL e se o endpoint `/stripe/checkout/:id` funciona.

## 📚 Referências

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/important-defaults)

---

**Status:** ✅ Implementação completa e funcional
**Última atualização:** 2024
