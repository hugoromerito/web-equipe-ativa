# Página de Informações do Paciente/Applicant

## 📋 Descrição

Criada uma página completa e profissional para visualizar todas as informações detalhadas de um paciente (applicant), organizada em cards temáticos com design hospitalar.

---

## 🎨 Features

### ✅ Visual e UX
- **Design profissional** com cards organizados por categoria
- **Avatar circular** com inicial do nome
- **Badge de idade** calculado automaticamente
- **Barra de completude** do perfil (0-100%)
- **Ícones temáticos** para cada tipo de informação
- **Modo escuro** totalmente suportado
- **Layout responsivo** (mobile-first)

### ✅ Seções de Informações

1. **Header do Paciente**
   - Nome completo e idade
   - Data de cadastro
   - Botão "Editar"
   - Barra de progresso da completude do perfil

2. **Informações Pessoais**
   - Nome completo
   - Data de nascimento (com idade calculada)
   - Telefone
   - CPF

3. **Documentos e Cartões**
   - Cartão SUS
   - Ticket/Convênio

4. **Filiação**
   - Nome da mãe
   - Nome do pai

5. **Endereço Completo**
   - CEP
   - Rua e número
   - Bairro
   - Cidade/Estado
   - Complemento (se houver)

6. **Observações** (se houver)
   - Texto completo com quebras de linha preservadas

7. **Metadados** (rodapé)
   - ID do registro
   - Data de cadastro
   - Data da última atualização

---

## 📁 Arquivos Criados

### 1. `src/app/.../applicant/[applicant]/info/page.tsx`
**Server Component** que:
- Busca dados do paciente via `getApplicant()`
- Trata erros de carregamento
- Passa dados para o componente visual

```typescript
export default async function ApplicantInfoPage() {
  // Busca org e applicant do contexto
  // Faz requisição à API
  // Renderiza ApplicantInfoView
}
```

### 2. `src/app/.../applicant/[applicant]/info/applicant-info-view.tsx`
**Client Component** que:
- Exibe informações organizadas em cards
- Calcula idade automaticamente
- Calcula completude do perfil
- Trata dados ausentes com "Não informado"
- Fornece componente `InfoItem` reutilizável

```typescript
export function ApplicantInfoView({ applicant, error }) {
  // Renderiza cards organizados
  // Calcula idade e completude
  // Exibe estados de erro
}
```

### 3. `src/http/get-applicant.ts` (atualizado)
**Tipo atualizado** para incluir todos os campos:
```typescript
interface GetApplicantResponse {
  applicant: {
    // ✅ Campos adicionados:
    sus_card: string | null
    zip_code: string | null
    state: string | null
    city: string | null
    street: string | null
    neighborhood: string | null
    complement: string | null
    number: string | null
    // ... (e mais campos já existentes)
  }
}
```

---

## 🎯 Funcionalidades Especiais

### Cálculo Automático de Idade
```typescript
const calculateAge = (birthdate: string) => {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  // Ajusta se ainda não fez aniversário este ano
  return age
}
```

### Barra de Completude do Perfil
- **Campos obrigatórios**: name, birthdate, phone, cpf (peso maior)
- **Campos opcionais**: mother, father, street, city, state, zip_code
- **Cores dinâmicas**:
  - 🟢 Verde: ≥80%
  - 🟡 Amarelo: 50-79%
  - 🔴 Vermelho: <50%

### Tratamento de Dados Ausentes
Cada campo mostra:
- ✅ **Valor** se disponível
- ⚠️ **"Não informado"** se nulo/vazio (em itálico cinza)

---

## 🚀 Rota de Acesso

```
/org/[org]/unit/[unit]/applicant/[applicant]/info
```

**Exemplo:**
```
/org/casa-do-autista/unit/recepcao/applicant/joao-silva/info
```

---

## 🎨 Componentes Visuais

### Cards Temáticos com Ícones
| Card | Ícone | Cor |
|------|-------|-----|
| Informações Pessoais | `User` | Azul |
| Documentos | `CreditCard` | Verde |
| Filiação | `Users` | Roxo |
| Endereço | `MapPin` | Vermelho |
| Observações | `FileText` | Laranja |

### Componente `InfoItem`
Componente reutilizável para exibir informações:
```tsx
<InfoItem 
  icon={<Phone />}
  label="Telefone"
  value={applicant.phone}
  badge="Principal" // opcional
  extra="WhatsApp" // opcional
/>
```

---

## 🔧 Integração com Outras Páginas

### Botão "Editar"
```tsx
<Button asChild>
  <Link href={`/org/${org}/unit/${unit}/applicant/${id}/edit`}>
    <Edit /> Editar
  </Link>
</Button>
```

**Nota:** Página de edição deve ser criada no futuro.

---

## ✅ Estado de Loading e Erros

### Error State
```tsx
<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Erro ao carregar informações</AlertTitle>
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

### Not Found State
```tsx
<Alert>
  <AlertCircle />
  <AlertTitle>Paciente não encontrado</AlertTitle>
</Alert>
```

---

## 📱 Responsividade

- **Mobile (< 768px)**: Cards em coluna única
- **Desktop (≥ 1024px)**: Grid 2 colunas
- **Breakpoints**: Tailwind padrão (sm, md, lg, xl)

---

## 🎨 Design System

### Cores por Status de Completude
- `bg-green-500`: ≥80% completo
- `bg-yellow-500`: 50-79% completo
- `bg-red-500`: <50% completo

### Espaçamentos
- Cards: `gap-6`
- Conteúdo interno: `space-y-4`
- Seções: `space-y-6`

### Tipografia
- Título principal: `text-2xl font-bold`
- Labels: `text-sm font-medium text-muted-foreground`
- Valores: `text-sm font-semibold`

---

## 🧪 Testes Sugeridos

1. ✅ Acesse com paciente completo (todos os campos)
2. ✅ Acesse com paciente parcial (alguns campos vazios)
3. ✅ Teste com paciente sem endereço
4. ✅ Teste com paciente sem filiação
5. ✅ Verifique cálculo de idade
6. ✅ Verifique % de completude
7. ✅ Teste responsividade (mobile/desktop)
8. ✅ Teste dark mode

---

## 🚀 Melhorias Futuras (Opcional)

1. **Timeline de histórico** de atualizações
2. **Lista de consultas** deste paciente
3. **Gráfico de progresso** do tratamento
4. **Botão de impressão** (PDF)
5. **Exportar dados** (JSON/CSV)
6. **QR Code** para ficha do paciente
7. **Fotos/anexos** do paciente
8. **Contatos de emergência** adicionais

---

## 📝 Notas Técnicas

- ✅ Server Component para SEO e performance
- ✅ Client Component apenas para UI interativa
- ✅ Lazy loading de imagens (se implementadas)
- ✅ Formatação de datas via `formatLocalDate`
- ✅ Validação de nulls/undefined em todos os campos

---

**Status**: ✅ **Implementado e funcional**
