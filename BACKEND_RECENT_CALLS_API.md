# Backend - Implementação do Endpoint de Chamadas Recentes

## 📋 Endpoint Necessário

```
GET /organizations/:orgSlug/units/:unitSlug/demands/recent-calls?minutes=5
```

## 🎯 Objetivo

Retornar as demandas que mudaram para status `IN_PROGRESS` nos últimos X minutos (padrão: 5 minutos).

## 📥 Request

### Path Parameters
- `orgSlug` (string): Slug da organização
- `unitSlug` (string): Slug da unidade

### Query Parameters
- `minutes` (number, opcional): Janela de tempo em minutos (padrão: 5)

### Headers
```
Authorization: Bearer {token}
```

## 📤 Response

### Success (200 OK)

```json
{
  "calls": [
    {
      "demandId": "clx123abc",
      "patientName": "Maria Silva Santos",
      "patientAvatar": "https://example.com/avatar.jpg",
      "professionalName": "Dr. João Pedro",
      "scheduledTime": "2024-03-20T14:30:00.000Z",
      "updatedAt": "2024-03-20T14:28:35.000Z"
    },
    {
      "demandId": "clx456def",
      "patientName": "Carlos Alberto Souza",
      "patientAvatar": null,
      "professionalName": "Dra. Ana Paula",
      "scheduledTime": "2024-03-20T14:45:00.000Z",
      "updatedAt": "2024-03-20T14:25:12.000Z"
    }
  ]
}
```

### TypeScript Interface

```typescript
interface RecentCall {
  demandId: string
  patientName: string
  patientAvatar?: string | null
  professionalName?: string | null
  scheduledTime?: string | null
  updatedAt: string
}

interface GetRecentCallsResponse {
  calls: RecentCall[]
}
```

## 🔨 Implementação

### Prisma/PostgreSQL

```typescript
// controllers/demands.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getRecentCalls(req: Request, res: Response) {
  const { orgSlug, unitSlug } = req.params
  const minutes = parseInt(req.query.minutes as string) || 5

  // Buscar organização e unidade
  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug }
  })

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' })
  }

  const unit = await prisma.unit.findFirst({
    where: {
      slug: unitSlug,
      organizationId: organization.id
    }
  })

  if (!unit) {
    return res.status(404).json({ message: 'Unit not found' })
  }

  // Calcular timestamp de corte
  const cutoffDate = new Date()
  cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes)

  // Buscar demandas
  const demands = await prisma.demand.findMany({
    where: {
      unitId: unit.id,
      status: 'IN_PROGRESS',
      updatedAt: {
        gte: cutoffDate
      }
    },
    include: {
      applicant: {
        select: {
          name: true,
          avatarUrl: true
        }
      },
      member: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Formatar resposta
  const calls = demands.map(demand => ({
    demandId: demand.id,
    patientName: demand.applicant.name,
    patientAvatar: demand.applicant.avatarUrl,
    professionalName: demand.member?.user.name || null,
    scheduledTime: demand.scheduledTime?.toISOString() || null,
    updatedAt: demand.updatedAt.toISOString()
  }))

  return res.json({ calls })
}
```

### Sequelize/MySQL

```typescript
import { Request, Response } from 'express'
import { Organization, Unit, Demand, Applicant, Member, User } from '../models'
import { Op } from 'sequelize'

export async function getRecentCalls(req: Request, res: Response) {
  const { orgSlug, unitSlug } = req.params
  const minutes = parseInt(req.query.minutes as string) || 5

  // Buscar organização
  const organization = await Organization.findOne({
    where: { slug: orgSlug }
  })

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' })
  }

  // Buscar unidade
  const unit = await Unit.findOne({
    where: {
      slug: unitSlug,
      organizationId: organization.id
    }
  })

  if (!unit) {
    return res.status(404).json({ message: 'Unit not found' })
  }

  // Calcular timestamp de corte
  const cutoffDate = new Date()
  cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes)

  // Buscar demandas
  const demands = await Demand.findAll({
    where: {
      unitId: unit.id,
      status: 'IN_PROGRESS',
      updatedAt: {
        [Op.gte]: cutoffDate
      }
    },
    include: [
      {
        model: Applicant,
        attributes: ['name', 'avatarUrl']
      },
      {
        model: Member,
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ]
      }
    ],
    order: [['updatedAt', 'DESC']]
  })

  // Formatar resposta
  const calls = demands.map(demand => ({
    demandId: demand.id,
    patientName: demand.applicant.name,
    patientAvatar: demand.applicant.avatarUrl || null,
    professionalName: demand.member?.user?.name || null,
    scheduledTime: demand.scheduledTime?.toISOString() || null,
    updatedAt: demand.updatedAt.toISOString()
  }))

  return res.json({ calls })
}
```

### TypeORM

```typescript
import { Request, Response } from 'express'
import { getRepository, MoreThanOrEqual } from 'typeorm'
import { Organization, Unit, Demand } from '../entities'

export async function getRecentCalls(req: Request, res: Response) {
  const { orgSlug, unitSlug } = req.params
  const minutes = parseInt(req.query.minutes as string) || 5

  const orgRepo = getRepository(Organization)
  const unitRepo = getRepository(Unit)
  const demandRepo = getRepository(Demand)

  // Buscar organização
  const organization = await orgRepo.findOne({
    where: { slug: orgSlug }
  })

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' })
  }

  // Buscar unidade
  const unit = await unitRepo.findOne({
    where: {
      slug: unitSlug,
      organization: { id: organization.id }
    }
  })

  if (!unit) {
    return res.status(404).json({ message: 'Unit not found' })
  }

  // Calcular timestamp de corte
  const cutoffDate = new Date()
  cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes)

  // Buscar demandas
  const demands = await demandRepo.find({
    where: {
      unit: { id: unit.id },
      status: 'IN_PROGRESS',
      updatedAt: MoreThanOrEqual(cutoffDate)
    },
    relations: ['applicant', 'member', 'member.user'],
    order: {
      updatedAt: 'DESC'
    }
  })

  // Formatar resposta
  const calls = demands.map(demand => ({
    demandId: demand.id,
    patientName: demand.applicant.name,
    patientAvatar: demand.applicant.avatarUrl || null,
    professionalName: demand.member?.user?.name || null,
    scheduledTime: demand.scheduledTime?.toISOString() || null,
    updatedAt: demand.updatedAt.toISOString()
  }))

  return res.json({ calls })
}
```

## 🛣️ Rota

```typescript
// routes/demands.routes.ts
import { Router } from 'express'
import { getRecentCalls } from '../controllers/demands.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get(
  '/organizations/:orgSlug/units/:unitSlug/demands/recent-calls',
  authenticate, // Middleware de autenticação
  getRecentCalls
)

export default router
```

## 🔐 Autenticação

O endpoint deve:
1. ✅ Verificar se o usuário está autenticado
2. ✅ Verificar se o usuário tem acesso à organização/unidade
3. ✅ Retornar apenas dados da unidade solicitada

## 📊 Índices Recomendados

Para melhor performance, crie índices no banco:

```sql
-- PostgreSQL / MySQL
CREATE INDEX idx_demands_unit_status_updated 
ON demands(unit_id, status, updated_at DESC);

CREATE INDEX idx_demands_status_updated 
ON demands(status, updated_at DESC);
```

## 🎯 Lógica de Negócio

### Critérios de Filtro

Uma demanda aparece na tela se:
1. ✅ Status = `IN_PROGRESS`
2. ✅ `updatedAt` está dentro da janela de tempo (últimos X minutos)
3. ✅ Pertence à unidade solicitada

### Ordenação

As chamadas são ordenadas por `updatedAt DESC`, ou seja:
- A chamada mais recente aparece primeiro
- Isso garante que a última mudança de status seja destacada

## ⚡ Performance

### Otimizações

1. **Use índices**: Conforme sugerido acima
2. **Limite de resultados**: Considere adicionar um LIMIT
3. **Cache**: Considere cache de 2-3 segundos no Redis
4. **Paginação**: Se houver muitas chamadas simultâneas

### Exemplo com Limite

```typescript
const demands = await prisma.demand.findMany({
  where: {
    unitId: unit.id,
    status: 'IN_PROGRESS',
    updatedAt: {
      gte: cutoffDate
    }
  },
  take: 10, // Máximo de 10 chamadas
  // ... resto do código
})
```

## 🧪 Testes

### Teste Manual com cURL

```bash
curl -X GET \
  'http://localhost:3333/organizations/hospital-central/units/clinica-geral/demands/recent-calls?minutes=5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Teste de Integração (Jest)

```typescript
describe('GET /recent-calls', () => {
  it('should return recent IN_PROGRESS demands', async () => {
    // Criar demanda de teste
    const demand = await createTestDemand({
      status: 'IN_PROGRESS',
      updatedAt: new Date()
    })

    const response = await request(app)
      .get('/organizations/test-org/units/test-unit/demands/recent-calls')
      .set('Authorization', `Bearer ${token}`)
      .query({ minutes: 5 })

    expect(response.status).toBe(200)
    expect(response.body.calls).toHaveLength(1)
    expect(response.body.calls[0].demandId).toBe(demand.id)
  })

  it('should not return demands older than specified minutes', async () => {
    // Criar demanda antiga
    const oldDate = new Date()
    oldDate.setMinutes(oldDate.getMinutes() - 10)

    await createTestDemand({
      status: 'IN_PROGRESS',
      updatedAt: oldDate
    })

    const response = await request(app)
      .get('/organizations/test-org/units/test-unit/demands/recent-calls')
      .set('Authorization', `Bearer ${token}`)
      .query({ minutes: 5 })

    expect(response.body.calls).toHaveLength(0)
  })
})
```

## 🐛 Troubleshooting

### Problema: Nenhuma chamada retornada

**Verificar:**
1. Status está realmente `IN_PROGRESS`?
2. `updatedAt` foi atualizado recentemente?
3. Demanda pertence à unidade correta?
4. Consulta SQL está correta?

**Debug:**
```typescript
console.log('Cutoff date:', cutoffDate)
console.log('Unit ID:', unit.id)
console.log('Demands found:', demands.length)
```

### Problema: Performance lenta

**Soluções:**
1. Adicionar índices (veja seção de índices)
2. Reduzir janela de tempo (5 → 3 minutos)
3. Adicionar cache
4. Limitar número de resultados

## 📚 Referências

- [Prisma Docs - Filtering](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)
- [Sequelize Docs - Querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)
- [TypeORM Docs - Find Options](https://typeorm.io/find-options)

---

**✅ Checklist de Implementação**

- [ ] Criar endpoint na rota correta
- [ ] Implementar lógica de filtro por status e tempo
- [ ] Adicionar autenticação
- [ ] Testar com dados reais
- [ ] Criar índices no banco
- [ ] Testar performance
- [ ] Documentar no Swagger/OpenAPI
- [ ] Criar testes automatizados

