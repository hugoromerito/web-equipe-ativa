# 🎙️ Configuração do ElevenLabs Text-to-Speech

## ✨ Por que ElevenLabs?
- ✅ **Vozes EXTREMAMENTE naturais** (melhor que Google)
- ✅ **Configuração super simples** (só precisa de email)
- ✅ **10.000 caracteres grátis/mês** (~166 chamadas)
- ✅ **Não precisa cartão de crédito** no plano gratuito
- ✅ **Suporta português brasileiro**

---

## 🚀 Passo a Passo (5 minutos)

### **1️⃣ Criar Conta** (2 minutos)

1. Acesse: **https://elevenlabs.io/**
2. Clique em "**Sign Up**" (Registrar)
3. Preencha:
   - Email
   - Senha
4. Confirme o email (verifique a caixa de entrada)
5. Faça login

---

### **2️⃣ Obter API Key** (1 minuto)

1. Após fazer login, clique no ícone do seu perfil (canto superior direito)
2. Clique em "**Profile + API Key**"
3. Ou acesse diretamente: **https://elevenlabs.io/app/settings/api-keys**
4. Clique em "**Create API Key**" ou copie a chave já existente
5. **COPIE A CHAVE** (formato: `sk_...`)

---

### **3️⃣ Adicionar no Projeto** (1 minuto)

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione a chave:
   ```bash
   ELEVENLABS_API_KEY=sk_sua_chave_aqui
   ```
3. Salve o arquivo
4. Reinicie o servidor:
   ```bash
   npm run dev
   ```

---

## 🎯 **Pronto! Teste agora:**

1. Acesse a TV Display: `/tv/[org]/[unit]`
2. Mude o status de uma demanda para "EM ANDAMENTO"
3. Ouça a voz super natural chamando o paciente! 🎙️

---

## 🎨 Personalizar Vozes

### **Vozes Disponíveis em Português:**

O código já está configurado com **Adam** (masculina, clara), mas você pode trocar por:

| Voice ID | Nome | Descrição | Gênero |
|----------|------|-----------|--------|
| `pNInz6obpgDQGcFmaJgB` | Adam | Clara, profissional | Masculino |
| `EXAVITQu4vr4xnSDxMaL` | Bella | Calma, suave | Feminino |
| `21m00Tcm4TlvDq8ikWAM` | Rachel | Natural, amigável | Feminino |
| `VR6AewLTigWG4xSOukaG` | Arnold | Grave, autoritária | Masculino |
| `AZnzlk1XvdvUeBnXmlld` | Domi | Jovem, energética | Feminino |

### **Como Trocar a Voz:**

Edite o arquivo `src/app/api/tts/route.ts`:

```typescript
const voiceId = 'EXAVITQu4vr4xnSDxMaL' // ← Troque aqui
```

### **Testar Vozes:**

1. Acesse: https://elevenlabs.io/app/voice-lab
2. Clique em cada voz para ouvir
3. Digite em português para testar
4. Copie o Voice ID da que você gostar

---

## ⚙️ Ajustar Configurações de Voz

No arquivo `src/app/api/tts/route.ts`, você pode ajustar:

```typescript
voice_settings: {
  stability: 0.5,          // 0-1: Estabilidade (0.5 = equilibrado)
  similarity_boost: 0.75,  // 0-1: Similaridade à voz (0.75 = alta)
  style: 0.5,              // 0-1: Intensidade do estilo
  use_speaker_boost: true, // Melhora clareza
}
```

### **Recomendações:**
- **Para voz mais calma:** `stability: 0.7`
- **Para voz mais expressiva:** `stability: 0.3`
- **Para máxima clareza:** `use_speaker_boost: true`

---

## 💰 Limites e Custos

### **Plano Gratuito:**
- ✅ **10.000 caracteres/mês**
- ✅ ~166 chamadas de pacientes
- ✅ Não precisa cartão
- ❌ Limite pode ser pouco para clínicas grandes

### **Se Ultrapassar o Limite:**

**Opção 1: Plano Starter (US$ 5/mês)**
- 30.000 caracteres/mês (~500 chamadas)
- Sem filas de espera
- Acesso a todas as vozes

**Opção 2: Plano Creator (US$ 11/mês)**
- 100.000 caracteres/mês (~1.666 chamadas)
- Vozes personalizadas
- Prioridade no processamento

**Opção 3: Usar Web Speech API como fallback** (já implementado!)
- Se acabar os créditos do ElevenLabs, o sistema usa automaticamente a voz do navegador
- Zero custo adicional

---

## 📊 Monitorar Uso

1. Acesse: https://elevenlabs.io/app/usage
2. Veja quantos caracteres já usou
3. Acompanhe o limite mensal

---

## 🔍 Troubleshooting

### **Erro: "API key não configurada"**
- Verifique se adicionou a chave no `.env.local`
- Reinicie o servidor: `npm run dev`

### **Erro: "Quota exceeded"**
- Você atingiu o limite de 10.000 caracteres/mês
- O sistema vai usar Web Speech API automaticamente (fallback)
- Ou faça upgrade do plano

### **Voz está em inglês:**
- Certifique-se de usar `model_id: 'eleven_multilingual_v2'`
- Teste com texto em português no Voice Lab primeiro

### **Áudio não reproduz:**
- Verifique o console do navegador (F12)
- Veja se há erros de CORS
- Tente dar permissão de áudio no navegador

---

## 📚 Links Úteis

- **Site:** https://elevenlabs.io/
- **API Keys:** https://elevenlabs.io/app/settings/api-keys
- **Voice Lab:** https://elevenlabs.io/app/voice-lab
- **Usage:** https://elevenlabs.io/app/usage
- **Documentação:** https://docs.elevenlabs.io/

---

## ✨ Vantagens do ElevenLabs

1. **Qualidade Superior:** Vozes mais naturais que Google/Azure
2. **Setup Simples:** Só precisa de email, sem cartão
3. **Fallback Automático:** Se acabar créditos, usa Web Speech
4. **Português Nativo:** Suporte completo ao pt-BR
5. **Teste Grátis:** 10k caracteres para testar sem compromisso

---

## 🎯 Sistema Atual

- ✅ **Voz primária:** ElevenLabs (Adam - masculina clara)
- ✅ **Fallback:** Web Speech API (se ElevenLabs falhar)
- ✅ **Mensagem:** "[Nome], comparecer ao consultório do doutor [Médico]"
- ✅ **Modelo:** eleven_multilingual_v2 (suporta português)
- ✅ **Configurações otimizadas** para clareza máxima
