# 🧪 Guia de Teste - Sistema WebSocket de Chamada de Pacientes

## 🚀 Como Testar o Sistema

### Passo 1: Iniciar o Servidor

```bash
npm run dev
```

Aguarde até ver:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 📺 Passo 2: Abrir a TV Display

1. **Abra em uma aba/janela separada:**
   ```
   http://localhost:3000/tv-display
   ```

2. **Pressione F11** para modo fullscreen (opcional)

3. **Verifique o indicador de conexão:**
   - 🟢 Verde = Conectado (pronto para receber chamadas)
   - 🔴 Vermelho = Desconectado (verifique o console)

---

## 🧪 Passo 3: Testar Chamada de Paciente

### Opção A: Usando cURL (Terminal)

```bash
# Testar chamada de 1 paciente
curl -X POST http://localhost:3000/api/test/call-patient \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org-123",
    "patientName": "João Silva",
    "doctorName": "Dr. Maria Santos",
    "room": "Consultório 1"
  }'
```

### Opção B: Usando PowerShell (Windows)

```powershell
# Testar chamada de 1 paciente
Invoke-RestMethod -Uri "http://localhost:3000/api/test/call-patient" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"organizationId":"org-123","patientName":"João Silva","doctorName":"Dr. Maria Santos","room":"Consultório 1"}'
```

### Opção C: Usando Postman/Insomnia

1. **Método:** POST
2. **URL:** `http://localhost:3000/api/test/call-patient`
3. **Headers:** `Content-Type: application/json`
4. **Body (JSON):**
   ```json
   {
     "organizationId": "org-123",
     "patientName": "João Silva",
     "doctorName": "Dr. Maria Santos",
     "room": "Consultório 1"
   }
   ```

### Opção D: Usando o Console do Navegador

1. Abra o console (F12) em qualquer página
2. Cole e execute:

```javascript
fetch('http://localhost:3000/api/test/call-patient', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    organizationId: 'org-123',
    patientName: 'Maria Oliveira',
    doctorName: 'Dr. Pedro Costa',
    room: 'Consultório 2'
  })
})
.then(r => r.json())
.then(data => console.log('Resposta:', data));
```

---

## 🎯 Passo 4: Verificar Resultado

**Na TV Display, você deve ver:**

1. ✅ Grande destaque amarelo com o nome do paciente
2. ✅ Ícone de sino 🔔
3. ✅ Texto "CHAMANDO PACIENTE"
4. ✅ Nome do médico e sala
5. ✅ Paciente aparece na lista de "Últimas Chamadas"
6. ✅ Som de notificação (se configurado)

**O destaque permanece por 15 segundos!**

---

## 🔄 Testar Múltiplas Chamadas

### Chamar 5 pacientes seguidos (com 2 segundos de intervalo)

```bash
# cURL
curl -X PUT http://localhost:3000/api/test/call-patient \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "org-123", "count": 5}'
```

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/test/call-patient" `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"organizationId":"org-123","count":5}'
```

**Você verá:**
- João Silva (aparece na TV)
- *aguarda 2 segundos*
- Ana Oliveira (aparece na TV)
- *aguarda 2 segundos*
- Carlos Souza (aparece na TV)
- ... e assim por diante

---

## 🐛 Debugging

### Ver Logs do Servidor

No terminal onde você rodou `npm run dev`, você deve ver:

```
Client connected: abc123
Socket abc123 joined organization org-123
Patient called emitted to org-org-123: { name: 'João Silva', ... }
```

### Ver Logs do Cliente (TV Display)

1. Na aba da TV Display, abra o console (F12)
2. Você deve ver:

```
WebSocket conectado
Socket connected: abc123
Paciente chamado: { name: "João Silva", ... }
```

### Problemas Comuns

#### ❌ Não conecta

**Solução:**
1. Verifique se o servidor está rodando
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Tente fechar e abrir a aba novamente

#### ❌ Não recebe chamadas

**Solução:**
1. Verifique o `organizationId` (deve ser o mesmo na TV e no teste)
2. Abra o console e veja se há erros
3. Confirme que o indicador está verde

#### ❌ Som não toca

**Solução:**
1. Adicione o arquivo de som em `public/sounds/call-notification.mp3`
2. Ou comente o código do som em `tv-display/page.tsx`

---

## 📊 Testes Avançados

### Teste de Reconexão

1. Abra a TV Display
2. Pare o servidor (Ctrl+C)
3. Observe o indicador ficar vermelho
4. Inicie o servidor novamente (`npm run dev`)
5. A TV deve reconectar automaticamente

### Teste de Múltiplas TVs

1. Abra 2 abas da TV Display
2. Faça uma chamada de teste
3. Ambas as TVs devem receber a chamada

### Teste de Organizações Diferentes

```bash
# TV 1 está em org-123
# Chame em org-456
curl -X POST http://localhost:3000/api/test/call-patient \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "org-456", "patientName": "Teste"}'
```

**Resultado esperado:** TV 1 NÃO deve receber (organizações diferentes)

---

## ✅ Checklist de Teste

- [ ] Servidor iniciado
- [ ] TV Display aberta
- [ ] Indicador verde (conectado)
- [ ] Primeira chamada recebida com sucesso
- [ ] Nome do paciente aparece destacado
- [ ] Paciente entra na lista de últimas chamadas
- [ ] Múltiplas chamadas funcionam
- [ ] Reconexão funciona após queda
- [ ] Logs aparecem no console

---

## 🎉 Próximos Passos

Após testar com sucesso:

1. **Integre com seu backend real:**
   - Adicione `emitPatientCall` no endpoint de atualização de demanda
   - Use os dados reais do paciente, médico e sala

2. **Configure uma TV física:**
   - Conecte um computador/tablet à TV
   - Abra o navegador em fullscreen
   - Acesse `/tv-display`
   - Deixe rodando 24/7

3. **Ajuste o design:**
   - Modifique cores em `tv-display/page.tsx`
   - Ajuste tamanhos de fonte
   - Personalize animações

4. **Adicione som personalizado:**
   - Grave ou compre um som de chamada
   - Salve em `public/sounds/call-notification.mp3`

5. **Remova endpoints de teste** (produção):
   - Apague `src/app/api/test/call-patient/route.ts`

---

## 📞 Suporte

Se algo não funcionar:

1. ✅ Verifique os logs do servidor e cliente
2. ✅ Confirme que o organizationId está correto
3. ✅ Teste com os endpoints de exemplo
4. ✅ Consulte `WEBSOCKET_IMPLEMENTATION.md`

---

**Bom teste! 🚀**
