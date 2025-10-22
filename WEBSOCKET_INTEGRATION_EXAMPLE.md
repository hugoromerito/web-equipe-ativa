# 🔌 Exemplo de Integração - WebSocket no Endpoint de Demandas

## 📍 Onde Adicionar o Código

Localize seu endpoint de atualização de demandas. Provavelmente está em um destes lugares:

- `src/app/api/demands/[id]/route.ts`
- `src/app/api/demands/update/route.ts`
- `src/app/api/demands/status/route.ts`

---

## 📝 ANTES (Sem WebSocket)

```typescript
// src/app/api/demands/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ou seu ORM

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, ...otherData } = body;

    // Atualiza a demanda
    const updatedDemand = await prisma.demand.update({
      where: { id: params.id },
      data: {
        status,
        ...otherData,
      },
    });

    return NextResponse.json({
      success: true,
      demand: updatedDemand,
    });
  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { error: 'Failed to update demand' },
      { status: 500 }
    );
  }
}
```

---

## ✅ DEPOIS (Com WebSocket)

```typescript
// src/app/api/demands/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ou seu ORM
import { emitPatientCall } from '@/lib/socket-server'; // ← ADICIONE ESTA LINHA

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, ...otherData } = body;

    // Atualiza a demanda COM INCLUDE para buscar dados relacionados
    const updatedDemand = await prisma.demand.update({
      where: { id: params.id },
      data: {
        status,
        ...otherData,
      },
      include: {                    // ← ADICIONE INCLUDE
        patient: true,              // ← Para pegar nome do paciente
        doctor: true,               // ← Para pegar nome do médico
        organization: true,         // ← Para pegar ID da organização
      },
    });

    // ← ADICIONE ESTE BLOCO INTEIRO
    // Se o status mudou para "em andamento", chama o paciente na TV
    if (status === 'in_progress' || status === 'em_andamento') {
      emitPatientCall(updatedDemand.organization.id, {
        id: updatedDemand.patient.id,
        name: updatedDemand.patient.name,
        demandId: updatedDemand.id,
        doctorName: updatedDemand.doctor?.name || 'Médico',
        room: updatedDemand.room || 'Consultório',
        timestamp: new Date().toISOString(),
      });
      
      console.log(`🔔 Paciente ${updatedDemand.patient.name} chamado na TV!`);
    }
    // ← FIM DO BLOCO ADICIONADO

    return NextResponse.json({
      success: true,
      demand: updatedDemand,
    });
  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { error: 'Failed to update demand' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 Resumo das Mudanças

### 1. Import necessário (linha 4)
```typescript
import { emitPatientCall } from '@/lib/socket-server';
```

### 2. Adicionar `include` na query (linhas 18-22)
```typescript
include: {
  patient: true,
  doctor: true,
  organization: true,
},
```

### 3. Adicionar chamada WebSocket (linhas 25-36)
```typescript
if (status === 'in_progress' || status === 'em_andamento') {
  emitPatientCall(updatedDemand.organization.id, {
    id: updatedDemand.patient.id,
    name: updatedDemand.patient.name,
    demandId: updatedDemand.id,
    doctorName: updatedDemand.doctor?.name || 'Médico',
    room: updatedDemand.room || 'Consultório',
    timestamp: new Date().toISOString(),
  });
  
  console.log(`🔔 Paciente ${updatedDemand.patient.name} chamado na TV!`);
}
```

---

## 🔍 Adaptações Necessárias

Dependendo da sua estrutura de dados, ajuste:

### Se usar campo diferente para status:
```typescript
// Ao invés de:
if (status === 'in_progress')

// Use:
if (status === 'seu_status_aqui')
// Exemplos: 'ATENDIMENTO', 'EM_CONSULTA', 'CHAMADO', etc.
```

### Se os campos têm nomes diferentes:
```typescript
// Ajuste os nomes dos campos:
emitPatientCall(updatedDemand.organizationId, { // se for organizationId
  name: updatedDemand.patientName,              // se for patientName
  doctorName: updatedDemand.doctorName,         // se for direto no demand
  room: updatedDemand.consultorio,              // se for consultorio
  // ...
});
```

### Se não usa Prisma:
```typescript
// Busque os dados separadamente:
const patient = await getPatient(updatedDemand.patientId);
const doctor = await getDoctor(updatedDemand.doctorId);
const organization = await getOrganization(updatedDemand.orgId);

emitPatientCall(organization.id, {
  name: patient.name,
  doctorName: doctor.name,
  // ...
});
```

---

## 🧪 Como Testar

### 1. Faça uma requisição real ao seu endpoint:

```bash
curl -X PATCH http://localhost:3000/api/demands/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

### 2. Verifique os logs do servidor:

Você deve ver:
```
🔔 Paciente João Silva chamado na TV!
Patient called emitted to org-org-123: { name: "João Silva", ... }
```

### 3. Verifique a TV Display:

O paciente deve aparecer **instantaneamente** na tela!

---

## 📋 Checklist de Integração

- [ ] Import de `emitPatientCall` adicionado
- [ ] `include` adicionado na query (se usar Prisma)
- [ ] Bloco de `if (status === 'in_progress')` adicionado
- [ ] Campos ajustados para sua estrutura de dados
- [ ] Testado com requisição real
- [ ] Paciente aparece na TV Display
- [ ] Logs aparecem no servidor

---

## 🎨 Exemplo Completo com Mais Detalhes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitPatientCall, emitDemandStatusUpdate } from '@/lib/socket-server';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Autenticação (se necessário)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse do body
    const body = await request.json();
    const { status, notes, room, ...otherData } = body;

    // 3. Atualiza a demanda
    const updatedDemand = await prisma.demand.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        room,
        ...otherData,
        updatedAt: new Date(),
        updatedBy: currentUser.id,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 4. WebSocket: Chama paciente se status é "em andamento"
    if (status === 'in_progress') {
      emitPatientCall(updatedDemand.organization.id, {
        id: updatedDemand.patient.id,
        name: updatedDemand.patient.name,
        demandId: updatedDemand.id,
        doctorName: updatedDemand.doctor?.name,
        room: room || updatedDemand.room || 'Consultório',
        timestamp: new Date().toISOString(),
      });
      
      console.log(`🔔 Paciente ${updatedDemand.patient.name} chamado na TV!`);
    }

    // 5. WebSocket: Notifica mudança de status (geral)
    emitDemandStatusUpdate(updatedDemand.organization.id, {
      id: updatedDemand.id,
      status: updatedDemand.status,
      patientName: updatedDemand.patient.name,
      timestamp: new Date().toISOString(),
    });

    // 6. (Opcional) Enviar SMS
    // if (status === 'in_progress' && updatedDemand.patient.phone) {
    //   await sendSMS(updatedDemand.patient.phone, 
    //     `Olá ${updatedDemand.patient.name}, dirija-se ao ${room}`
    //   );
    // }

    // 7. Retorna sucesso
    return NextResponse.json({
      success: true,
      demand: updatedDemand,
      message: 'Demanda atualizada com sucesso',
    });

  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update demand',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

## 🚨 Possíveis Erros

### Erro: "Cannot find module '@/lib/socket-server'"

**Solução:** Verifique se o arquivo existe:
```
src/lib/socket-server.ts
```

### Erro: "emitPatientCall is not a function"

**Solução:** Verifique o import:
```typescript
import { emitPatientCall } from '@/lib/socket-server';
```

### Erro: "Cannot read property 'id' of undefined"

**Solução:** Verifique se os `include` estão corretos e os dados existem:
```typescript
include: {
  patient: true,
  doctor: true,
  organization: true,
}
```

### Nada acontece na TV

**Soluções:**
1. Verifique se o `organizationId` está correto
2. Confirme que a TV está conectada (indicador verde)
3. Verifique logs do servidor
4. Abra console da TV (F12) e veja erros

---

## 💡 Dicas

1. **Log tudo no início:**
   ```typescript
   console.log('📝 Atualizando demanda:', params.id, 'para status:', status);
   ```

2. **Teste primeiro com endpoint de teste:**
   ```bash
   POST /api/test/call-patient
   ```
   
3. **Só integre no endpoint real depois que funcionar no teste!**

4. **Mantenha os logs de debug durante desenvolvimento:**
   ```typescript
   console.log('🔔 Chamando paciente:', patientName);
   ```

5. **Remova endpoints de teste em produção**

---

## ✅ Pronto!

Agora é só:
1. ✅ Adicionar o código no seu endpoint
2. ✅ Ajustar para sua estrutura de dados
3. ✅ Testar
4. ✅ Abrir TV Display em modo fullscreen
5. ✅ Usar o sistema normalmente!

**O paciente será chamado automaticamente na TV quando o status mudar!** 🎉
