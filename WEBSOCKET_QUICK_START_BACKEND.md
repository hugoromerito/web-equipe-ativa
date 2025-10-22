# 🎯 Guia Rápido - Integração com Backend WebSocket

## ⚡ Setup em 3 Passos

### 1️⃣ Configurar Variável de Ambiente

Crie ou edite `.env.local`:

```env
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3333
```

### 2️⃣ Acessar TV Display

```
http://localhost:3000/org/[org-slug]/unit/[unit-slug]/tv-display
```

**Exemplo real:**
```
http://localhost:3000/org/minha-clinica/unit/unidade-centro/tv-display
```

### 3️⃣ Testar

1. Mude o status de uma demanda para **IN_PROGRESS** no backend
2. O paciente aparece **instantaneamente** na TV!

---

## ✅ O Que Foi Adaptado

O sistema frontend foi **100% integrado** com seu backend WebSocket existente:

- ✅ Conecta na **porta 3333** (seu backend)
- ✅ Usa evento `**patient-called**` (do seu backend)
- ✅ Entra na sala com `**join-unit**` (formato do seu backend)
- ✅ Exibe todos os campos: `patientName`, `memberName`, `jobTitle`, `priority`
- ✅ Cores por prioridade: URGENT (vermelho), HIGH (laranja), MEDIUM (amarelo), LOW (azul)

---

## 📡 Formato do Evento (Seu Backend)

```typescript
// patient-called
{
  demandId: string;
  patientName: string;        // ← Nome exibido grande na TV
  memberName: string;         // ← Profissional que chamou
  jobTitle: string | null;    // ← Cargo do profissional
  status: "IN_PROGRESS";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";  // ← Com cores
  calledAt: Date;
  unitId: string;
  unitSlug: string;
  organizationId: string;
}
```

---

## 🎨 Interface da TV

- **Nome do Paciente** em fonte gigante (9xl)
- **Nome do Profissional** com ícone 👨‍⚕️
- **Cargo** (se disponível)
- **Prioridade** com cor (vermelho/laranja/amarelo/azul)
- **Relógio** em tempo real
- **Status de conexão** (verde/vermelho)
- **Últimas 10 chamadas**
- **Destaque por 15 segundos**

---

## 🔍 Verificar Funcionamento

### Console do Navegador (F12)

```
✅ Socket connected: abc123
📡 Joining unit: minha-org/unidade-centro
🔔 Paciente chamado: { patientName: "João Silva", ... }
```

### Indicador Visual

- 🟢 **Verde pulsando** = Conectado e funcionando
- 🔴 **Vermelho** = Desconectado (verifique backend)

---

## 🚨 Problemas?

### Backend não rodando
```bash
# Inicie o backend na porta 3333
```

### Variável não configurada
```env
# .env.local
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3333
```

### TV não recebe eventos
- Confirme que URL tem org-slug e unit-slug corretos
- Verifique console (F12) para erros

---

## 🎉 Pronto!

O sistema está **100% integrado** com seu backend WebSocket!

**Basta:**
1. ✅ Configurar `.env.local`
2. ✅ Abrir TV Display
3. ✅ Mudar status de demanda para `IN_PROGRESS`
4. ✅ Ver paciente aparecer na TV instantaneamente!

---

**Documentação completa:** [WEBSOCKET_INTEGRATION_BACKEND.md](WEBSOCKET_INTEGRATION_BACKEND.md)
