# Fix para getMembersOrganizationRoute

## Problema Identificado

A API `getMembersOrganizationRoute` no backend não retorna os campos `last_seen` e `is_online`, enquanto a API `getMembersUnitRoute` retorna esses campos corretamente.

## Arquivo a ser corrigido no backend:
`src/http/routes/members/get-members-organization.ts`

## Mudanças necessárias:

### 1. Adicionar import para date-fns
```ts
import { differenceInMinutes } from 'date-fns'
```

### 2. Atualizar o schema de resposta:
```ts
response: {
  200: z.object({
    members: z.array(
      z.object({
        id: z.uuid(),
        organization_role: roleZodEnum,
        user: z.object({
          id: z.uuid(),
          name: z.string().nullable(),
          email: z.email(),
          avatar_url: z.string().nullable(),
          last_seen: z.date(),  // ADICIONAR
        }),
        is_online: z.boolean(),  // ADICIONAR
      })
    ),
    totalCount: z.number(),
  }),
},
```

### 3. Atualizar a query para incluir last_seen:
```ts
const membersResult = await db
  .select({
    id: members.id,
    organization_role: members.organization_role,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar_url: users.avatar_url,
      last_seen: users.last_seen,  // ADICIONAR
    },
  })
  .from(members)
  .leftJoin(users, eq(users.id, members.user_id))
  .where(eq(members.organization_id, organization.id))
  .orderBy(asc(members.organization_role))
  .limit(pageSize)
  .offset(offset)
```

### 4. Atualizar o filtro e mapeamento:
```ts
// Filtrar membros com usuários válidos
const validMembers = membersResult
  .filter((member): member is typeof member & { user: NonNullable<typeof member.user> } => 
    member.user !== null && member.user.id !== null && member.user.last_seen !== null
  )
  .map((member) => {
    const isOnline = member.user.last_seen && 
      differenceInMinutes(new Date(), new Date(member.user.last_seen)) <= 5

    return {
      id: member.id,
      organization_role: member.organization_role,
      user: member.user,
      is_online: isOnline,
    }
  })

return reply.send({ 
  members: validMembers,
  totalCount
})
```

## Resultado esperado:
A API `getMembersOrganizationRoute` retornará os campos `last_seen` e `is_online` assim como a API `getMembersUnitRoute`.