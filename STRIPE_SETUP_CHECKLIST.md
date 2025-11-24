# 🚀 Checklist de Configuração do Sistema de Pagamentos

## ✅ Pré-requisitos

### 1. Conta Stripe
- [ ] Criar conta em [stripe.com](https://stripe.com)
- [ ] Ativar modo de teste
- [ ] Obter chaves de API (Dashboard → Developers → API Keys)

### 2. Backend Configurado
- [ ] Backend rodando com todas as rotas de billing
- [ ] Variáveis de ambiente do Stripe configuradas no backend:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Migrations de billing executadas
- [ ] Seeds de planos criados (opcional)

## 📦 Instalação Frontend

### 1. Dependências
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install @radix-ui/react-progress
```

### 2. Variáveis de Ambiente
Criar/editar `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_seu_publishable_key_aqui
```

⚠️ **Importante:** Use a chave **pública** (pk_test_...) no frontend!

## 🔧 Configuração do Stripe

### 1. Configurar Webhooks (Desenvolvimento Local)

Instalar Stripe CLI:
```bash
# Windows (Scoop)
scoop install stripe

# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Linux
# Download from: https://github.com/stripe/stripe-cli/releases
```

Login e forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3333/webhooks/stripe
```

Copiar o webhook secret exibido e adicionar ao backend `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configurar Webhooks (Produção)

No [Stripe Dashboard](https://dashboard.stripe.com):

1. Ir em **Developers → Webhooks**
2. Clicar em **Add endpoint**
3. Adicionar URL: `https://seu-dominio.com/webhooks/stripe`
4. Selecionar eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiar **Signing secret** e adicionar ao `.env` do backend

### 3. Criar Produtos e Preços

#### Opção A: Pelo Dashboard

1. **Produtos → Add product**
2. Criar produtos para cada plano:
   - Nome: "Plano Básico"
   - Descrição: recursos do plano
   - Preço: valor mensal e anual
   - Recorrente: sim
3. Copiar IDs dos produtos e preços
4. Atualizar tabela `plans` no banco de dados

#### Opção B: Via API/Seeds

Usar seeds no backend para criar automaticamente.

## 🗄️ Banco de Dados

### 1. Executar Migrations
```bash
npm run db:migrate
```

### 2. Popular Planos (Seeds)
```bash
npm run db:seed
```

Ou criar manualmente via SQL/API.

## 🧪 Testar Implementação

### 1. Verificar Integração

#### Teste 1: Lista de Planos
```bash
curl http://localhost:3333/plans
```
Deve retornar array de planos.

#### Teste 2: Chave Pública Configurada
```tsx
// No frontend
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
```
Deve exibir `pk_test_...`

### 2. Testar Fluxo Completo

1. Acesse `/subscription`
2. Selecione um plano
3. Use cartão de teste: `4242 4242 4242 4242`
4. Expiry: qualquer data futura
5. CVC: qualquer 3 dígitos
6. ZIP: qualquer 5 dígitos
7. Confirme o pagamento
8. Verifique redirecionamento para `/subscription/success`

### 3. Testar Webhooks

```bash
stripe trigger customer.subscription.created
```

Verifique no backend se o webhook foi recebido e processado.

## 🎨 Customização

### 1. Cores do Stripe Elements

Editar `src/components/stripe-provider.tsx`:
```tsx
variables: {
  colorPrimary: '#sua-cor',
  colorBackground: '#sua-cor',
  colorText: '#sua-cor',
  colorDanger: '#sua-cor',
}
```

### 2. Textos e Labels

Editar componentes conforme necessário:
- `src/components/pricing-card.tsx`
- `src/components/checkout-form.tsx`
- `src/app/(app)/subscription/page.tsx`

## 🔐 Segurança

### ✅ Checklist de Segurança

- [ ] Chave secreta do Stripe **NUNCA** no frontend
- [ ] Validação de webhooks ativada no backend
- [ ] HTTPS em produção
- [ ] Client secrets únicos por transação
- [ ] Validação de limites no backend E frontend
- [ ] Logs de transações habilitados
- [ ] Tratamento de erros implementado

## 📱 Deploy

### 1. Variáveis de Ambiente (Produção)

Na sua plataforma de deploy (Vercel, Railway, etc.):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_seu_publishable_key
```

⚠️ Use chave **LIVE** em produção!

### 2. Configurar Domínio no Stripe

1. Stripe Dashboard → Settings → Branding
2. Adicionar seu domínio
3. Configurar URLs de retorno

### 3. Ativar Modo Live

1. Toggle "Test mode" para OFF
2. Completar verificação da conta
3. Adicionar informações bancárias
4. Configurar webhooks de produção

## 🐛 Troubleshooting

### Erro: "Stripe publishable key not found"
**Solução:** Verificar se `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` está no `.env.local`

### Erro: "Invalid API Key provided"
**Solução:** Usar chave correta (pk_test_ para teste, pk_live_ para produção)

### Webhook não recebe eventos
**Solução:** 
- Verificar se Stripe CLI está rodando (dev)
- Verificar URL do webhook (prod)
- Verificar eventos selecionados

### Pagamento não atualiza status
**Solução:**
- Verificar logs do backend
- Verificar se webhook foi recebido
- Verificar validação da assinatura do webhook

### Limite não é verificado
**Solução:**
- Verificar se assinatura está ativa
- Verificar se plano tem limites configurados
- Verificar chamadas à API de limites

## 📊 Monitoramento

### 1. Stripe Dashboard

Monitorar em tempo real:
- Pagamentos
- Assinaturas
- Falhas
- Webhooks

### 2. Logs do Backend

Verificar logs para:
- Erros de webhook
- Falhas de pagamento
- Tentativas de exceder limites

### 3. Métricas Úteis

- Taxa de conversão de trial → pago
- Churn rate
- MRR (Monthly Recurring Revenue)
- Uso médio de recursos

## ✅ Checklist Final

### Desenvolvimento
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Webhooks configurados (Stripe CLI)
- [ ] Planos criados no Stripe
- [ ] Migrations executadas
- [ ] Seeds populados
- [ ] Testes passando
- [ ] Fluxo completo testado

### Produção
- [ ] Chaves de produção configuradas
- [ ] Webhooks de produção configurados
- [ ] Domínio verificado no Stripe
- [ ] Conta Stripe verificada
- [ ] Informações bancárias adicionadas
- [ ] SSL/HTTPS ativo
- [ ] Monitoramento configurado
- [ ] Backups configurados
- [ ] Logs de auditoria ativos

## 📚 Recursos Úteis

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Status](https://status.stripe.com)
- [Stripe Support](https://support.stripe.com)
- [Testing Guide](https://stripe.com/docs/testing)

## 🆘 Suporte

Se encontrar problemas:

1. Verificar este checklist
2. Consultar documentação do Stripe
3. Verificar logs do backend
4. Testar com cartões de teste
5. Verificar webhook events no Dashboard

---

**Status do Sistema:** ✅ Pronto para uso após completar este checklist!
