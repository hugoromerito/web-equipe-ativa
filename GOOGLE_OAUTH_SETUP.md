# Configuração do Google OAuth

## ⚠️ Problema: "Acesso Bloqueado" no Login com Google

Se você está recebendo erro de "acesso bloqueado" ao tentar fazer login com Google, siga este checklist:

## ✅ Checklist de Configuração

### 1. Google Cloud Console - Configurar URIs de Redirecionamento

Acesse: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

1. Selecione seu projeto
2. Vá em **Credenciais** (Credentials)
3. Clique no seu **OAuth 2.0 Client ID**
4. Na seção **Authorized redirect URIs**, adicione:

```
https://didactic-cod-4rg975jr5pqcjvx6-3000.app.github.dev/api/auth/callback/google
```

⚠️ **IMPORTANTE**: A URL deve ser EXATAMENTE igual à que está no arquivo `.env`:
```env
GOOGLE_OAUTH_CLIENT_REDIRECT_URI=https://didactic-cod-4rg975jr5pqcjvx6-3000.app.github.dev/api/auth/callback/google
```

### 2. Google Cloud Console - Configurar Origens JavaScript

Na mesma página de configuração do OAuth 2.0, adicione em **Authorized JavaScript origins**:

```
https://didactic-cod-4rg975jr5pqcjvx6-3000.app.github.dev
```

### 3. Verificar Escopos OAuth

Certifique-se de que seu app está solicitando apenas os escopos necessários:
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

### 4. Tela de Consentimento OAuth

1. Vá em **OAuth consent screen**
2. Certifique-se de que:
   - O app está configurado (Internal ou External)
   - Os escopos corretos estão adicionados
   - Se for External e ainda em Testing, adicione seu email como Test User

### 5. Verificar Variáveis de Ambiente

Arquivo `.env`:
```env
GOOGLE_OAUTH_CLIENT_ID=521595965196-k2idp4f70qfcqdmbqioklcafosdrddm0.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=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
GOOGLE_OAUTH_CLIENT_REDIRECT_URI=https://didactic-cod-4rg975jr5pqcjvx6-3000.app.github.dev/api/auth/callback/google
```

## 🔍 Diagnóstico de Erros

### Erro: "redirect_uri_mismatch"
- A URL no `.env` não está registrada no Google Console
- Verifique que não há espaços extras ou barras no final

### Erro: "access_blocked"
- Seu email não está na lista de Test Users (se o app está em Testing)
- O app não foi publicado (se for External)

### Erro: "invalid_client"
- Client ID ou Client Secret incorretos
- Verifique as credenciais no arquivo `.env`

## 🧪 Testar a Configuração

1. Reinicie o servidor Next.js:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/auth/sign-in`

3. Clique em "Continuar com Google"

4. Você deve ser redirecionado para a página de consentimento do Google

5. Após autorizar, deve ser redirecionado de volta para: `/api/auth/callback/google?code=...`

6. E então redirecionado para a home `/`

## 📝 URLs Importantes

- **Desenvolvimento Local**: `http://localhost:3000`
- **Codespace Atual**: `https://didactic-cod-4rg975jr5pqcjvx6-3000.app.github.dev`
- **Callback Route**: `/api/auth/callback/google`

## ⚠️ Nota sobre GitHub Codespaces

A URL do Codespace muda cada vez que você cria um novo workspace. Quando isso acontecer:

1. Atualize `GOOGLE_OAUTH_CLIENT_REDIRECT_URI` no `.env`
2. Atualize as URIs no Google Cloud Console
3. Reinicie o servidor

## 🔧 Troubleshooting Adicional

Se ainda não funcionar, verifique nos logs do terminal:
- Mensagens de erro do callback
- Status da autenticação com o backend
- Erros de token

Os logs agora incluem emojis para facilitar:
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso
