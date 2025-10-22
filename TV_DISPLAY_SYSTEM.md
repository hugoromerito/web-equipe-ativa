# Sistema de Chamada de Pacientes para TV

## 📺 Visão Geral

Sistema de chamada de pacientes em tempo real para exibição em TVs na recepção. Quando um médico altera o status de uma demanda para "EM ANDAMENTO", o nome do paciente aparece automaticamente na TV chamando-o para o atendimento.

## 🎯 Funcionalidades

- ✅ **Detecção automática**: Monitora mudanças de status para "IN_PROGRESS"
- ✅ **Atualização em tempo real**: Polling a cada 3 segundos
- ✅ **Interface visual atrativa**: Design moderno com animações
- ✅ **Destaque da chamada atual**: Primeira chamada com animação pulsante
- ✅ **Histórico recente**: Mostra chamadas dos últimos 5 minutos
- ✅ **Relógio em tempo real**: Data e hora atualizadas

## 🚀 Como Usar

### 1. Acessar a Página de Display

A página está disponível na rota:
```
/org/[organizacao]/unit/[unidade]/tv-display
```

**Exemplo:**
```
https://seu-dominio.com/org/hospital-central/unit/clinica-geral/tv-display
```

### 2. Configurar a TV

1. Abra o navegador na TV (Chrome, Firefox, Edge)
2. Acesse a URL do display
3. Pressione **F11** para entrar em modo fullscreen
4. Deixe a página aberta - ela atualizará automaticamente

### 3. Fluxo de Uso

1. **Check-in na recepção**: Paciente chega e faz check-in
2. **Médico pronto**: Quando pronto para atender, o médico:
   - Acessa a demanda do paciente
   - Altera o status para **"Em andamento"**
3. **Chamada na TV**: Automaticamente:
   - O nome do paciente aparece na TV
   - Animação de destaque chama atenção
   - Informações do profissional são exibidas
   - Horário agendado é mostrado (se houver)

## 🎨 Interface da TV

### Header
- Logo/ícone de chamada
- Título "Chamada de Pacientes"
- Relógio em tempo real com data e hora

### Área de Chamadas
- **Chamada Principal** (primeira):
  - Fundo verde com animação pulsante
  - Badge "CHAMANDO AGORA" com sino animado
  - Avatar grande do paciente
  - Nome em destaque
  - Profissional responsável
  - Horário do agendamento
  - Banner amarelo: "Por favor, dirija-se ao consultório"

- **Chamadas Recentes** (seguintes):
  - Fundo azul
  - Mesmo layout mas sem animação pulsante
  - Histórico dos últimos 5 minutos

### Footer
- Instruções para os pacientes
- Dica visual sobre ficar atento

## 🔧 Configurações Técnicas

### Parâmetros Ajustáveis

No arquivo `tv-display-client.tsx`, você pode ajustar:

```typescript
// Intervalo de atualização (em milissegundos)
const interval = setInterval(fetchCalls, 3000) // 3 segundos

// Janela de tempo para mostrar chamadas (em minutos)
minutes: 5 // Últimos 5 minutos
```

### API Endpoint

O sistema usa o endpoint:
```
GET /organizations/{org}/units/{unit}/demands/recent-calls?minutes=5
```

## 📱 Backend - Implementação Necessária

O backend precisa implementar o endpoint `/recent-calls` que retorna:

```typescript
interface RecentCall {
  demandId: string
  patientName: string
  patientAvatar?: string
  professionalName?: string
  scheduledTime?: string
  updatedAt: string
}

interface Response {
  calls: RecentCall[]
}
```

### Lógica do Backend

```sql
-- Exemplo de query (ajuste para seu ORM)
SELECT 
  d.id as demandId,
  a.name as patientName,
  a.avatarUrl as patientAvatar,
  u.name as professionalName,
  d.scheduledTime,
  d.updatedAt
FROM demands d
JOIN applicants a ON d.applicantId = a.id
LEFT JOIN members m ON d.memberId = m.id
LEFT JOIN users u ON m.userId = u.id
WHERE 
  d.organizationId = :orgId
  AND d.unitId = :unitId
  AND d.status = 'IN_PROGRESS'
  AND d.updatedAt >= NOW() - INTERVAL :minutes MINUTE
ORDER BY d.updatedAt DESC
```

### Exemplo de Implementação (Node.js/Express)

```typescript
// backend/routes/demands.ts
router.get(
  '/organizations/:orgSlug/units/:unitSlug/demands/recent-calls',
  async (req, res) => {
    const { orgSlug, unitSlug } = req.params
    const minutes = parseInt(req.query.minutes as string) || 5

    const org = await Organization.findOne({ slug: orgSlug })
    const unit = await Unit.findOne({ slug: unitSlug, organizationId: org.id })

    const cutoffTime = new Date()
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes)

    const demands = await Demand.findAll({
      where: {
        unitId: unit.id,
        status: 'IN_PROGRESS',
        updatedAt: {
          [Op.gte]: cutoffTime
        }
      },
      include: [
        { model: Applicant, attributes: ['name', 'avatarUrl'] },
        { 
          model: Member, 
          include: [{ model: User, attributes: ['name'] }]
        }
      ],
      order: [['updatedAt', 'DESC']]
    })

    const calls = demands.map(d => ({
      demandId: d.id,
      patientName: d.applicant.name,
      patientAvatar: d.applicant.avatarUrl,
      professionalName: d.member?.user?.name,
      scheduledTime: d.scheduledTime,
      updatedAt: d.updatedAt
    }))

    res.json({ calls })
  }
)
```

## 🎭 Personalização Visual

### Cores do Tema

Você pode personalizar as cores editando o arquivo `tv-display-client.tsx`:

```typescript
// Background gradient
className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"

// Chamada atual (verde)
className="bg-gradient-to-r from-green-500 to-emerald-600"

// Chamadas recentes (azul)
className="bg-gradient-to-r from-blue-500 to-blue-600"
```

### Animações

As animações CSS estão definidas no final do componente:
- `slideIn`: Animação de entrada suave
- `pulse`: Efeito pulsante para destaque

## 🔐 Segurança

- A página requer autenticação (organização e unidade)
- Somente dados públicos são exibidos (nome do paciente)
- Sem informações sensíveis na tela

## 📊 Monitoramento

### Logs Úteis

O componente registra erros no console:
```typescript
console.error('Erro ao buscar chamadas:', error)
```

Monitore o console do navegador para debug.

## ⚡ Performance

- **Polling**: 3 segundos (ajustável)
- **Janela de tempo**: 5 minutos (ajustável)
- **Otimizado** para rodar 24/7 sem problemas

## 🆘 Troubleshooting

### TV não atualiza
- Verifique conexão com internet
- Recarregue a página (F5)
- Verifique se o backend está respondendo

### Chamadas não aparecem
- Confirme que o status mudou para "IN_PROGRESS"
- Verifique se está dentro da janela de 5 minutos
- Verifique logs do backend

### Performance lenta
- Aumente o intervalo de polling para 5-10 segundos
- Reduza a janela de tempo de 5 para 3 minutos

## 🎉 Próximos Passos

### Melhorias Futuras

1. **Som de notificação** quando nova chamada aparecer
2. **WebSocket** ao invés de polling para tempo real verdadeiro
3. **QR Code** para feedback do paciente
4. **Múltiplas telas** com sincronização
5. **Painel de controle** para recepcionistas
6. **Estatísticas** de tempo de espera
7. **Senhas numéricas** como alternativa aos nomes
8. **Suporte a múltiplos idiomas**

## 📝 Notas Importantes

- ⚠️ Deixe a TV sempre ligada e com navegador aberto
- 💡 Use modo fullscreen (F11) para melhor experiência
- 🔄 A página se atualiza automaticamente, não precisa recarregar
- 🖥️ Funciona em qualquer navegador moderno (Chrome, Firefox, Edge)

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do navegador (F12)
2. Confirme que o backend está implementado
3. Teste a rota da API diretamente

---

**Desenvolvido com ❤️ para melhorar a experiência dos pacientes**
