# Formatação de Telefone, CPF e CEP na Página de Detalhes do Paciente

## 📋 Resumo

Adicionadas funções de formatação para exibir telefone, CPF e CEP de forma padronizada e legível na página de informações do paciente.

---

## ✅ Formatações Implementadas

### 1. Telefone
**Formato:** `(00) 91234-5678` ou `(00) 1234-5678`

**Regras:**
- 11 dígitos → `(XX) 9XXXX-XXXX` (celular)
- 10 dígitos → `(XX) XXXX-XXXX` (fixo)
- Outros formatos → mantém original

**Função:**
```typescript
const formatPhone = (phone: string | null) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}
```

**Exemplos:**
```
Input: "11987654321"
Output: "(11) 98765-4321"

Input: "1134567890"
Output: "(11) 3456-7890"
```

---

### 2. CPF
**Formato:** `123.456.789-01`

**Regras:**
- 11 dígitos → `XXX.XXX.XXX-XX`
- Outros formatos → mantém original

**Função:**
```typescript
const formatCPF = (cpf: string | null) => {
  if (!cpf) return null
  const digits = cpf.replace(/\D/g, '')
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  return cpf
}
```

**Exemplos:**
```
Input: "12345678901"
Output: "123.456.789-01"

Input: "123.456.789-01" (já formatado)
Output: "123.456.789-01"
```

---

### 3. CEP
**Formato:** `12345-678`

**Regras:**
- 8 dígitos → `XXXXX-XXX`
- Outros formatos → mantém original

**Função:**
```typescript
const formatCEP = (cep: string | null) => {
  if (!cep) return null
  const digits = cep.replace(/\D/g, '')
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`
  }
  return cep
}
```

**Exemplos:**
```
Input: "12345678"
Output: "12345-678"

Input: "01310100"
Output: "01310-100"
```

---

## 📁 Arquivo Modificado

**`src/app/.../info/applicant-info-view.tsx`**

### Mudanças:

1. **Adicionadas 3 funções** de formatação no componente
2. **Aplicadas formatações** nos campos:
   - `formatPhone(applicant.phone)` → Telefone
   - `formatCPF(applicant.cpf)` → CPF
   - `formatCEP(applicant.zip_code)` → CEP

---

## 🎯 Onde Aparece

### Card "Informações Pessoais"
```
┌─────────────────────────────────────┐
│ 👤 Informações Pessoais             │
├─────────────────────────────────────┤
│ 📞 Telefone                         │
│    (11) 98765-4321 ✨               │
│                                     │
│ 📄 CPF                              │
│    123.456.789-01 ✨                │
└─────────────────────────────────────┘
```

### Card "Endereço"
```
┌─────────────────────────────────────┐
│ 📍 Endereço                         │
├─────────────────────────────────────┤
│ 🧭 CEP                              │
│    12345-678 ✨                     │
│                                     │
│ 🏠 Rua                              │
│    Rua das Flores  Nº 123          │
└─────────────────────────────────────┘
```

---

## 🔧 Implementação Técnica

### Características das Funções

✅ **Null-safe**: Retorna `null` se valor for nulo
✅ **Defensiva**: Remove caracteres não-numéricos antes de formatar
✅ **Flexível**: Mantém formato original se não corresponder ao padrão esperado
✅ **Reutilizável**: Funções podem ser extraídas para um arquivo de utils se necessário

### Tratamento de Casos Especiais

| Entrada | Telefone | CPF | CEP |
|---------|----------|-----|-----|
| `null` | `null` | `null` | `null` |
| Já formatado | Mantém | Mantém | Mantém |
| Só números | Formata | Formata | Formata |
| Com caracteres | Remove e formata | Remove e formata | Remove e formata |
| Tamanho incorreto | Mantém original | Mantém original | Mantém original |

---

## 🎨 Visual Antes vs Depois

### Antes ❌
```
📞 Telefone
   11987654321

📄 CPF
   12345678901

🧭 CEP
   12345678
```

### Depois ✅
```
📞 Telefone
   (11) 98765-4321

📄 CPF
   123.456.789-01

🧭 CEP
   12345-678
```

---

## 📝 Código Completo das Funções

```typescript
// Telefone: (00) 91234-5678
const formatPhone = (phone: string | null) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}

// CPF: 123.456.789-01
const formatCPF = (cpf: string | null) => {
  if (!cpf) return null
  const digits = cpf.replace(/\D/g, '')
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  return cpf
}

// CEP: 12345-678
const formatCEP = (cep: string | null) => {
  if (!cep) return null
  const digits = cep.replace(/\D/g, '')
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`
  }
  return cep
}
```

---

## ✅ Checklist de Validação

- [x] Função `formatPhone` criada
- [x] Função `formatCPF` criada
- [x] Função `formatCEP` criada
- [x] Aplicada formatação no campo Telefone
- [x] Aplicada formatação no campo CPF
- [x] Aplicada formatação no campo CEP
- [x] Sem erros TypeScript
- [x] Tratamento de valores nulos
- [x] Tratamento de formatos já existentes

---

## 🚀 Melhorias Futuras (Opcional)

1. **Extrair para utils**: Mover funções para `src/utils/format-utils.ts`
2. **Validação**: Adicionar validação de CPF (dígitos verificadores)
3. **Máscaras em inputs**: Aplicar máscaras nos formulários de edição
4. **Internacionalização**: Suportar formatos de outros países
5. **Link de ação**: Tornar telefone clicável (WhatsApp/ligação)
6. **Copy to clipboard**: Botão para copiar CPF formatado

---

## 📊 Cobertura de Formatação

| Campo | Antes | Depois | Status |
|-------|-------|--------|--------|
| Telefone | ❌ | ✅ | Implementado |
| CPF | ❌ | ✅ | Implementado |
| CEP | ❌ | ✅ | Implementado |
| Data Nascimento | ✅ | ✅ | Já formatado |
| Datas (created/updated) | ✅ | ✅ | Já formatado |

---

**Status**: ✅ **Implementado e funcional**
