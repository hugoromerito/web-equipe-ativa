# 🎙️ Configuração do Google Cloud Text-to-Speech

## Passo a Passo para Configurar

### 1️⃣ Criar Conta no Google Cloud
1. Acesse: https://console.cloud.google.com/
2. Crie uma conta (se não tiver)
3. Ative o teste gratuito (recebe US$ 300 de crédito)

### 2️⃣ Criar um Projeto
1. No console, clique em "Criar Projeto"
2. Nome do projeto: `equipe-ativa-tts` (ou qualquer nome)
3. Clique em "Criar"

### 3️⃣ Ativar a API Text-to-Speech
1. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
2. Pesquise por "Cloud Text-to-Speech API"
3. Clique na API e depois em "Ativar"

### 4️⃣ Criar uma API Key
1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "+ CRIAR CREDENCIAIS"
3. Selecione "Chave de API"
4. Copie a chave gerada (formato: `AIzaSy...`)

### 5️⃣ Restringir a API Key (Recomendado)
1. Clique na chave criada para editar
2. Em "Restrições da aplicação":
   - Selecione "Referenciadores HTTP (sites)"
   - Adicione seu domínio: `https://seu-dominio.com/*`
3. Em "Restrições de API":
   - Selecione "Restringir chave"
   - Marque apenas "Cloud Text-to-Speech API"
4. Clique em "Salvar"

### 6️⃣ Adicionar a Chave no Projeto
1. Crie/edite o arquivo `.env.local` na raiz do projeto:
```bash
GOOGLE_CLOUD_TTS_API_KEY=SUA_CHAVE_AQUI
```

2. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 🎯 Vozes Disponíveis em Português (pt-BR)

### **Vozes Neural (Alta Qualidade)**
| Nome da Voz | Gênero | Qualidade | Recomendação |
|-------------|--------|-----------|--------------|
| `pt-BR-Neural2-A` | Masculino | ⭐⭐⭐⭐⭐ | Formal, profissional |
| `pt-BR-Neural2-B` | Masculino | ⭐⭐⭐⭐⭐ | Amigável, natural |
| `pt-BR-Neural2-C` | Feminino | ⭐⭐⭐⭐⭐ | **Recomendada - Calma e clara** |

### **Vozes WaveNet (Alta Qualidade)**
| Nome da Voz | Gênero | Qualidade |
|-------------|--------|-----------|
| `pt-BR-Wavenet-A` | Feminino | ⭐⭐⭐⭐ |
| `pt-BR-Wavenet-B` | Masculino | ⭐⭐⭐⭐ |
| `pt-BR-Wavenet-C` | Feminino | ⭐⭐⭐⭐ |

### **Vozes Standard (Qualidade Básica - Não recomendadas)**
| Nome da Voz | Gênero | Qualidade |
|-------------|--------|-----------|
| `pt-BR-Standard-A` | Feminino | ⭐⭐ |
| `pt-BR-Standard-B` | Masculino | ⭐⭐ |
| `pt-BR-Standard-C` | Feminino | ⭐⭐ |

---

## 🔧 Personalizar a Voz

Para trocar a voz, edite o arquivo `src/app/api/tts/route.ts`:

```typescript
voice: {
  languageCode: 'pt-BR',
  name: 'pt-BR-Neural2-C', // ← Troque aqui pela voz desejada
  ssmlGender: 'FEMALE', // ou 'MALE'
},
```

### Ajustar Velocidade e Tom:
```typescript
audioConfig: {
  audioEncoding: 'MP3',
  speakingRate: 0.95, // 0.25 a 4.0 (1.0 = normal)
  pitch: 0, // -20.0 a 20.0 (0 = normal)
  volumeGainDb: 0, // Volume em decibéis
},
```

---

## 💰 Limites e Custos

### **Nível Gratuito:**
- ✅ **1 milhão de caracteres por mês** (Neural/WaveNet)
- ✅ Renovado mensalmente
- ✅ Não expira (diferente dos US$ 300 de crédito)

### **Após o Limite Gratuito:**
- Neural/WaveNet: US$ 16,00 por 1 milhão de caracteres
- Standard: US$ 4,00 por 1 milhão de caracteres

### **Exemplo de Uso:**
- Mensagem média: 60 caracteres
- 1 milhão de caracteres = ~16.600 chamadas
- **100 chamadas/dia × 30 dias = 3.000 chamadas/mês = GRÁTIS** ✅

---

## 🧪 Testar a Voz

Acesse o playground do Google:
https://cloud.google.com/text-to-speech

1. Selecione o idioma: `Portuguese (Brazil)`
2. Escolha a voz: `pt-BR-Neural2-C`
3. Digite: "Maria Silva, comparecer ao consultório do doutor João Santos"
4. Clique em "Speak it"

---

## 🔍 Verificar Uso

1. Acesse: https://console.cloud.google.com/
2. Vá em "APIs e Serviços" > "Painel"
3. Clique em "Cloud Text-to-Speech API"
4. Veja o gráfico de requisições e caracteres usados

---

## ⚠️ Troubleshooting

### Erro: "API key not configured"
- Verifique se adicionou a chave no `.env.local`
- Reinicie o servidor (`npm run dev`)

### Erro: "API not enabled"
- Certifique-se de ativar a API no Google Cloud Console

### Erro: "Quota exceeded"
- Você atingiu o limite de 1M caracteres/mês
- Aguarde o próximo mês ou adicione faturamento

### Voz não está natural:
- Certifique-se de usar voz **Neural2** (melhor qualidade)
- Evite vozes **Standard** (qualidade ruim)

---

## 🎯 Sistema Atual

- ✅ **Voz primária:** Google Cloud TTS (pt-BR-Neural2-C)
- ✅ **Fallback:** Web Speech API (caso Google falhe)
- ✅ **Mensagem:** "[Nome], comparecer ao consultório do doutor [Médico]"
- ✅ **Volume:** Máximo
- ✅ **Velocidade:** 0.95x (um pouco mais lento para clareza)

---

## 📚 Documentação Oficial

- API Reference: https://cloud.google.com/text-to-speech/docs
- Guia de vozes: https://cloud.google.com/text-to-speech/docs/voices
- Preços: https://cloud.google.com/text-to-speech/pricing
