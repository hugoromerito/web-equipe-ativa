# TV Display - Guia de Troubleshooting e Melhores Práticas

## 🔍 Problemas Comuns e Soluções

### 1. Tela não atualiza / Paciente não aparece

#### Sintoma
O médico mudou o status para "Em andamento" mas o paciente não aparece na TV.

#### Checklist de Diagnóstico

✅ **Verificar status da demanda**
```typescript
// No console do navegador (F12)
const checkDemand = async () => {
  const response = await fetch('/api/demands/check-status')
  const data = await response.json()
  console.log('Status atual:', data.status)
}
```

✅ **Verificar timestamp da atualização**
- A demanda foi atualizada nos últimos 5 minutos?
- Se não, aumente a janela de tempo no backend

✅ **Verificar se o backend está respondendo**
```bash
# Teste direto da API
curl -X GET "http://localhost:3333/organizations/[org]/units/[unit]/demands/recent-calls?minutes=5" \
  -H "Authorization: Bearer TOKEN"
```

✅ **Verificar console do navegador**
```
F12 → Console → Procurar por erros
```

#### Soluções

**Solução 1: Limpar cache do navegador**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Solução 2: Verificar conexão com internet**
```javascript
// No console
console.log(navigator.onLine ? 'Online' : 'Offline')
```

**Solução 3: Verificar CORS (se backend em domínio diferente)**
```typescript
// backend: Adicionar headers CORS
app.use(cors({
  origin: 'https://seu-frontend.com',
  credentials: true
}))
```

**Solução 4: Aumentar janela de tempo**
```typescript
// tv-display-client.tsx
minutes: 10 // Em vez de 5
```

### 2. Performance Lenta / Travamentos

#### Sintoma
A tela fica lenta, congela ou consome muita memória.

#### Causas Possíveis

1. **Polling muito agressivo**
2. **Muitas demandas simultâneas**
3. **Memory leak**
4. **Navegador desatualizado**

#### Soluções

**Solução 1: Ajustar intervalo de polling**
```typescript
// tv-display-client.tsx
const interval = setInterval(fetchCalls, 5000) // 5s ao invés de 3s
```

**Solução 2: Limitar número de chamadas**
```typescript
// Backend
const demands = await prisma.demand.findMany({
  take: 5, // Máximo 5 chamadas por vez
  // ...
})
```

**Solução 3: Otimizar queries do backend**
```typescript
// Adicionar índices
// Usar select para buscar apenas campos necessários
select: {
  id: true,
  applicant: {
    select: { name: true, avatarUrl: true }
  }
}
```

**Solução 4: Restart periódico**
```bash
# Configurar reload automático diário (3h da manhã)
# No sistema operacional da TV
```

### 3. Animações não funcionam

#### Sintoma
Animações CSS não aparecem ou são cortadas.

#### Soluções

**Solução 1: Verificar se `tailwindcss-animate` está instalado**
```bash
npm install tailwindcss-animate
```

**Solução 2: Verificar configuração do Tailwind**
```javascript
// tailwind.config.js
module.exports = {
  plugins: [require('tailwindcss-animate')],
}
```

**Solução 3: Habilitar GPU acceleration**
```css
/* Adicionar no componente */
.animate-card {
  transform: translateZ(0);
  will-change: transform;
}
```

### 4. Tela não entra em fullscreen

#### Sintoma
Ao pressionar F11, a tela não fica em modo fullscreen.

#### Soluções

**Solução 1: Usar API de Fullscreen**
```typescript
// Adicionar botão para fullscreen
const enterFullscreen = () => {
  document.documentElement.requestFullscreen()
}

<button onClick={enterFullscreen}>Tela Cheia</button>
```

**Solução 2: Configuração do navegador**
- Chrome: Permitir fullscreen nas configurações do site
- Edge: Mesmo que Chrome
- Firefox: Verificar permissões

**Solução 3: Kiosk mode (para setup permanente)**
```bash
# Windows - Chrome em modo kiosk
chrome.exe --kiosk "https://seu-site.com/tv-display"

# Linux
chromium-browser --kiosk --incognito "https://seu-site.com/tv-display"
```

### 5. Autenticação expira

#### Sintoma
Após algumas horas, aparece tela de login.

#### Soluções

**Solução 1: Token de longa duração para TVs**
```typescript
// Backend: Criar token especial para displays
const tvToken = jwt.sign(
  { type: 'tv-display', orgId, unitId },
  secret,
  { expiresIn: '30d' } // 30 dias
)
```

**Solução 2: Refresh token automático**
```typescript
// tv-display-client.tsx
useEffect(() => {
  const refreshAuth = async () => {
    await fetch('/api/auth/refresh', { method: 'POST' })
  }
  
  const interval = setInterval(refreshAuth, 3600000) // 1 hora
  return () => clearInterval(interval)
}, [])
```

**Solução 3: URL com token embutido (menos seguro)**
```
/tv-display?token=LONG_LIVED_TOKEN
```

## 🎯 Melhores Práticas

### Setup da TV

#### Hardware Recomendado

✅ **TV com navegador integrado** (Smart TV)
- Samsung Tizen
- LG webOS
- Android TV

✅ **Computador dedicado** (recomendado para confiabilidade)
- Mini PC / Raspberry Pi 4
- Conexão ethernet (não Wi-Fi)
- Resolução: 1920x1080 (Full HD)

✅ **Navegador**
- Chrome (recomendado)
- Edge
- Firefox

#### Configurações do Sistema

**1. Desabilitar proteção de tela**
```
Windows: Configurações → Sistema → Energia → Nunca
Linux: gnome-tweaks → Energia
```

**2. Desabilitar atualizações automáticas**
```
Windows: Adiar atualizações do Windows Update
```

**3. Configurar inicialização automática**
```bash
# Windows - Criar atalho em
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp

# Conteúdo do atalho:
chrome.exe --kiosk "https://seu-site.com/tv-display"
```

**4. Desabilitar alertas e notificações**
```
Windows: Configurações → Sistema → Notificações → Desativar tudo
Chrome: chrome://flags → Desabilitar notificações
```

### Segurança

#### 1. URL dedicada para TV

❌ **Não use:**
```
/tv-display?token=abc123
```

✅ **Use:**
```
/tv-display (com autenticação por IP ou certificado)
```

#### 2. Whitelist de IPs

```typescript
// middleware.ts
const TV_IPS = ['192.168.1.100', '192.168.1.101']

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/tv-display')) {
    const ip = request.ip || request.headers.get('x-forwarded-for')
    
    if (!TV_IPS.includes(ip)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
}
```

#### 3. Token de acesso especial

```typescript
// Gerar token único para cada TV
const tvToken = generateTVToken({
  unitId: 'clinic-1',
  expiresIn: '90d',
  permissions: ['read:calls']
})

// URL da TV
https://seu-site.com/tv-display/${tvToken}
```

### Monitoramento

#### 1. Health Check

```typescript
// tv-display-client.tsx
useEffect(() => {
  const sendHeartbeat = async () => {
    await fetch('/api/tv-display/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ 
        unitId, 
        timestamp: new Date(),
        status: 'online'
      })
    })
  }
  
  const interval = setInterval(sendHeartbeat, 60000) // 1 minuto
  return () => clearInterval(interval)
}, [])
```

#### 2. Logs de Acesso

```typescript
// Backend: Registrar acessos
await db.tvDisplayLog.create({
  data: {
    unitId,
    action: 'page_view',
    timestamp: new Date(),
    ipAddress: req.ip
  }
})
```

#### 3. Alertas de Falha

```typescript
// Backend: Alertar se TV ficar offline
const checkTVStatus = async () => {
  const lastHeartbeat = await getLastHeartbeat(unitId)
  const minutesSinceLastHeartbeat = differenceInMinutes(new Date(), lastHeartbeat)
  
  if (minutesSinceLastHeartbeat > 5) {
    await sendAlert({
      type: 'tv_offline',
      message: `TV da ${unitName} está offline há ${minutesSinceLastHeartbeat} minutos`
    })
  }
}
```

### Performance

#### 1. Otimizar Imagens

```typescript
// next.config.ts
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
}
```

#### 2. Cache de Avatares

```typescript
// Backend: Cache de 1 hora para avatares
res.set('Cache-Control', 'public, max-age=3600')
```

#### 3. Lazy Loading (se aplicável)

```tsx
// Carregar imagens sob demanda
<Image
  src={call.patientAvatar}
  loading="lazy"
  alt={call.patientName}
/>
```

#### 4. Limpar memória periodicamente

```typescript
// Reload automático a cada 6 horas
useEffect(() => {
  const reloadInterval = setInterval(() => {
    window.location.reload()
  }, 6 * 60 * 60 * 1000) // 6 horas
  
  return () => clearInterval(reloadInterval)
}, [])
```

## 📊 Métricas de Sucesso

### KPIs para Monitorar

1. **Uptime da TV**
   - Meta: > 99%
   - Medir: Heartbeats recebidos vs esperados

2. **Latência de Exibição**
   - Meta: < 5 segundos após mudança de status
   - Medir: Timestamp da mudança vs primeira exibição

3. **Número de Chamadas por Dia**
   - Meta: Variável por unidade
   - Medir: Contagem de status IN_PROGRESS

4. **Satisfação dos Pacientes**
   - Meta: > 4/5 estrelas
   - Medir: Pesquisa pós-atendimento

### Dashboard de Métricas

```typescript
// Endpoint de métricas
GET /organizations/:org/units/:unit/tv-display/metrics

Response:
{
  "uptime": "99.8%",
  "callsToday": 45,
  "averageCallDuration": "2:35",
  "lastHeartbeat": "2024-03-20T15:30:00Z",
  "status": "online"
}
```

## 🚀 Melhorias Futuras

### Roadmap Sugerido

#### Fase 1 - Básico (Implementado)
- ✅ Exibição de chamadas em tempo real
- ✅ Animações visuais
- ✅ Polling automático

#### Fase 2 - Melhorias
- [ ] Som de notificação quando nova chamada
- [ ] WebSocket para tempo real verdadeiro
- [ ] Senhas numéricas (ex: "Senha 042")
- [ ] Múltiplos idiomas

#### Fase 3 - Avançado
- [ ] Integração com sistema de som (anúncio por voz)
- [ ] QR Code para feedback instantâneo
- [ ] Tempo de espera estimado
- [ ] Sincronização entre múltiplas TVs
- [ ] Modo escuro automático

#### Fase 4 - Analytics
- [ ] Dashboard de analytics
- [ ] Heatmap de horários de pico
- [ ] Previsão de tempo de espera
- [ ] Relatórios automáticos

### Exemplos de Implementação

#### Som de Notificação

```typescript
// tv-display-client.tsx
const [prevCallsCount, setPrevCallsCount] = useState(0)

useEffect(() => {
  if (calls.length > prevCallsCount) {
    // Nova chamada!
    const audio = new Audio('/sounds/notification.mp3')
    audio.play()
  }
  setPrevCallsCount(calls.length)
}, [calls])
```

#### WebSocket

```typescript
// tv-display-client.tsx
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/tv-display')
  
  ws.onmessage = (event) => {
    const newCall = JSON.parse(event.data)
    setCalls(prev => [newCall, ...prev])
  }
  
  return () => ws.close()
}, [])
```

#### Senhas Numéricas

```typescript
// Gerar senha sequencial
const generateTicketNumber = () => {
  const today = format(new Date(), 'yyyyMMdd')
  const count = await redis.incr(`tickets:${today}`)
  return count.toString().padStart(3, '0') // "001", "002", etc
}

// Exibir na tela
<div className="text-8xl font-bold">
  Senha {call.ticketNumber}
</div>
```

## 📞 Suporte

### Contatos

- **Documentação**: `TV_DISPLAY_SYSTEM.md`
- **Backend**: `BACKEND_RECENT_CALLS_API.md`
- **Integração**: `TV_DISPLAY_INTEGRATION.md`

### Debug Mode

```typescript
// Ativar modo debug com query param
// /tv-display?debug=true

const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true'

if (isDebug) {
  console.log('Calls:', calls)
  console.log('Last fetch:', new Date())
  console.log('Interval:', interval)
}
```

---

**🎉 Sistema pronto para produção!**

Com estas práticas, o sistema de TV Display será:
- ✅ Confiável (99%+ uptime)
- ✅ Performático (< 5s latência)
- ✅ Seguro (autenticação adequada)
- ✅ Monitorado (métricas e alertas)
