# 🎙️ Configuração do Azure AI Speech (Text-to-Speech)

## ✨ Por que Azure AI Speech?
- ✅ **5 MILHÕES de caracteres grátis/mês** (~83.000 chamadas!)
- ✅ **Vozes neurais de ALTA qualidade**
- ✅ **Francisca** - voz feminina perfeita para TEA (calma, clara)
- ✅ **Configuração relativamente simples**
- ✅ **Português brasileiro nativo**
- ✅ **Qualidade 9/10**

---

## 🚀 Passo a Passo (10 minutos)

### **1️⃣ Criar Conta Microsoft Azure** (3 minutos)

1. Acesse: **https://azure.microsoft.com/pt-br/free/**
2. Clique em "**Iniciar gratuitamente**"
3. Faça login com sua conta Microsoft (ou crie uma)
4. Preencha os dados:
   - Nome, país, telefone
   - **Adicione um cartão** (não será cobrado no nível gratuito)
5. Complete a verificação

**Você ganha:**
- R$ 750 em créditos por 30 dias
- 5M caracteres grátis de Speech por mês (PERMANENTE)

---

### **2️⃣ Criar Recurso Speech** (3 minutos)

1. No portal: **https://portal.azure.com/**
2. Clique em "**Criar um recurso**"
3. Pesquise por "**Speech**" ou "**Fala**"
4. Clique em "**Serviços de Fala**" (Speech Services)
5. Clique em "**Criar**"

6. Preencha:
   - **Assinatura:** Sua assinatura gratuita
   - **Grupo de recursos:** Crie um novo: `equipe-ativa-rg`
   - **Região:** `East US` (recomendado) ou `Brazil South`
   - **Nome:** `equipe-ativa-speech`
   - **Tipo de preço:** `Free F0` (5M caracteres grátis/mês)

7. Clique em "**Revisar + criar**"
8. Clique em "**Criar**"
9. Aguarde a implantação (1-2 minutos)

---

### **3️⃣ Obter as Credenciais** (2 minutos)

1. Após a implantação, clique em "**Ir para o recurso**"
2. No menu lateral, clique em "**Chaves e Ponto de Extremidade**"
3. Você verá:
   - **CHAVE 1** (KEY 1) - copie essa
   - **CHAVE 2** (KEY 2) - backup
   - **Localização/Região** - ex: `eastus`

4. **COPIE:**
   - A CHAVE 1: `abc123def456...`
   - A REGIÃO: `eastus` (ou a que você escolheu)

---

### **4️⃣ Adicionar no Projeto** (1 minuto)

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione:
   ```bash
   AZURE_SPEECH_KEY=sua_chave_aqui
   AZURE_SPEECH_REGION=eastus
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
3. Ouça a voz neural da Francisca chamando o paciente! 🎙️

---

## 🎨 Vozes Disponíveis em Português (pt-BR)

### **Vozes Neurais (Recomendadas):**

| Nome da Voz | Gênero | Descrição | Ideal para |
|-------------|--------|-----------|------------|
| **pt-BR-FranciscaNeural** ⭐ | Feminino | Calma, clara, profissional | **TEA, recepção** |
| pt-BR-BrendaNeural | Feminino | Jovem, energética | Ambientes dinâmicos |
| pt-BR-AntonioNeural | Masculino | Profissional, clara | Formal |
| pt-BR-ThalitaNeural | Feminino | Suave, amigável | Acolhedor |

### **Como Trocar a Voz:**

Edite o arquivo `src/app/api/tts/route.ts`:

```typescript
const voiceName = 'pt-BR-FranciscaNeural' // ← Troque aqui
```

### **Testar Vozes:**

1. Acesse: **https://speech.microsoft.com/portal/voicegallery**
2. Selecione "Portuguese (Brazil)"
3. Clique em cada voz para ouvir
4. Digite texto em português para testar

---

## ⚙️ Ajustar Configurações de Voz (SSML)

No arquivo `src/app/api/tts/route.ts`, você pode ajustar:

```xml
<prosody rate="0.90" pitch="-2%" volume="100">
  ${text}
</prosody>
```

### **Parâmetros:**

- **rate:** Velocidade (0.50 a 2.0)
  - `0.90` = 10% mais lento (ideal para TEA)
  - `1.0` = velocidade normal
  - `1.2` = 20% mais rápido

- **pitch:** Tom da voz (-50% a +50%)
  - `-2%` = ligeiramente mais grave (calmo)
  - `0%` = tom normal
  - `+10%` = mais agudo

- **volume:** Volume (0 a 100)
  - `100` = volume máximo
  - `80` = recomendado para TEA
  - `60` = mais suave

### **Configuração IDEAL para TEA:**

```xml
<prosody rate="0.85" pitch="-3%" volume="80">
  ${text}
</prosody>
```
- Velocidade mais lenta (0.85)
- Tom levemente mais grave (-3%)
- Volume confortável (80%)

---

## 💰 Limites e Custos

### **Nível Gratuito (F0):**
- ✅ **5 MILHÕES de caracteres/mês**
- ✅ ~**83.000 chamadas de pacientes/mês**
- ✅ Renovado mensalmente
- ✅ **PERMANENTE** (não expira)

### **Exemplo de Uso:**
- 100 chamadas/dia × 30 dias = 3.000 chamadas/mês
- 3.000 × 60 caracteres = 180.000 caracteres
- **Custo: R$ 0,00** (dentro do limite gratuito) ✅

### **Após o Limite (se ultrapassar):**
- **Tipo de preço S0:**
  - Voz Neural: US$ 15,00 por 1M caracteres
  - Por chamada: ~US$ 0,0009 (R$ 0,0045)

---

## 🌍 Regiões Disponíveis

| Região | Código | Latência (Brasil) |
|--------|--------|-------------------|
| East US | `eastus` | Média (~150ms) |
| Brazil South | `brazilsouth` | Baixa (~50ms) ⭐ |
| West Europe | `westeurope` | Alta (~200ms) |

**Recomendação:** Use `brazilsouth` se disponível para menor latência!

---

## 📊 Monitorar Uso

1. Acesse: **https://portal.azure.com/**
2. Vá para seu recurso Speech
3. No menu lateral: "**Métricas**"
4. Visualize:
   - Total de caracteres sintetizados
   - Número de requisições
   - Taxa de erro

---

## 🔍 Troubleshooting

### **Erro: "API key não configurada"**
- Verifique se adicionou a chave no `.env.local`
- Certifique-se de que não há espaços extras
- Reinicie o servidor: `npm run dev`

### **Erro: "Invalid subscription key"**
- Verifique se copiou a chave correta (KEY 1 ou KEY 2)
- Confirme que o recurso está ativo no Azure Portal

### **Erro: "Region mismatch"**
- Verifique se `AZURE_SPEECH_REGION` corresponde à região do recurso
- Exemplo: se criou em East US, use `eastus`

### **Voz está robótica:**
- Certifique-se de usar voz **Neural** (ex: `pt-BR-FranciscaNeural`)
- Evite vozes **Standard** (qualidade inferior)

### **Áudio não reproduz:**
- Verifique o console do navegador (F12)
- Teste se o recurso está ativo no Azure Portal
- Verifique se há créditos/limites disponíveis

---

## 🎯 Configuração IDEAL para TEA

```typescript
const voiceName = 'pt-BR-FranciscaNeural' // Voz calma e clara

const ssml = `
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR">
    <voice name="${voiceName}">
      <prosody rate="0.85" pitch="-3%" volume="80">
        ${text}
      </prosody>
    </voice>
  </speak>
`
```

**Essa configuração oferece:**
- ✅ Voz extremamente calma (Francisca)
- ✅ Velocidade reduzida (0.85)
- ✅ Tom levemente mais grave (-3%)
- ✅ Volume confortável (80%)
- ✅ Perfeita para ambiente TEA

---

## 📚 Links Úteis

- **Portal Azure:** https://portal.azure.com/
- **Speech Studio:** https://speech.microsoft.com/portal
- **Voice Gallery:** https://speech.microsoft.com/portal/voicegallery
- **Documentação:** https://docs.microsoft.com/azure/cognitive-services/speech-service/
- **Preços:** https://azure.microsoft.com/pt-br/pricing/details/cognitive-services/speech-services/

---

## ✨ Vantagens do Azure Speech

1. **5M caracteres GRÁTIS/mês** - muito superior ao ElevenLabs
2. **Francisca Neural** - voz perfeita para TEA
3. **Qualidade excelente** - 9/10
4. **Controle fino com SSML** - ajuste velocidade, tom, volume
5. **Latência baixa** - especialmente com Brazil South
6. **Fallback automático** - usa Web Speech se falhar

---

## 🎯 Sistema Atual

- ✅ **Voz primária:** Azure Speech (Francisca Neural)
- ✅ **Fallback:** Web Speech API (se Azure falhar)
- ✅ **Qualidade:** 9/10
- ✅ **Limite grátis:** 83.000 chamadas/mês
- ✅ **Otimizado para TEA:** Velocidade 0.90, Tom -2%, Volume 100%
