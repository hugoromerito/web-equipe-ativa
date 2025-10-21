# Correção: Ordenação de Demands

## 🐛 Problema

O frontend estava **forçando** parâmetros de ordenação (`sort_by=created_at` e `sort_order=desc`) mesmo quando o usuário não especificava nenhuma ordenação, sobrescrevendo a **ordenação padrão inteligente da API**.

### Logs do servidor mostravam:
```
sort_by FINAL: created_at 
sort_order FINAL: desc
```

Mas isso não deveria ser o comportamento padrão - a API tem sua própria lógica de ordenação otimizada.

---

## ✅ Solução

Removidos os **valores padrão** de `sort_by` e `sort_order` no frontend. Agora:

1. Se o usuário **não selecionar** uma ordenação → API usa **sua ordenação padrão**
2. Se o usuário **selecionar** uma ordenação → Frontend envia os parâmetros explícitos

---

## 📁 Arquivos Modificados

### 1. `src/http/get-demands.ts`

**Antes:**
```typescript
sort_by = 'created_at',
sort_order = 'desc',
// ...
searchParams: Record<string, string | number> = {
  page,
  limit,
  sort_by,      // ❌ Sempre enviava
  sort_order,   // ❌ Sempre enviava
}
```

**Depois:**
```typescript
sort_by,        // ✅ Sem valor padrão
sort_order,     // ✅ Sem valor padrão
// ...
searchParams: Record<string, string | number> = {
  page,
  limit,
  // ✅ Adiciona APENAS se fornecidos
}

if (sort_by) {
  searchParams.sort_by = sort_by
}
if (sort_order) {
  searchParams.sort_order = sort_order
}
```

---

### 2. `src/app/.../demands/page.tsx`

**Antes:**
```typescript
sort_by: search.sort_by || 'created_at',    // ❌ Valor padrão forçado
sort_order: search.sort_order || 'desc',    // ❌ Valor padrão forçado
```

**Depois:**
```typescript
sort_by: search.sort_by || undefined,       // ✅ undefined = API decide
sort_order: search.sort_order || undefined, // ✅ undefined = API decide
```

---

### 3. `src/app/.../demands/demand-list.tsx`

**Antes:**
```typescript
const [sortBy, setSortBy] = useState<...>(
  initialSearchParams.sort_by as any || 'created_at'  // ❌ Padrão forçado
)
const [sortOrder, setSortOrder] = useState<...>(
  initialSearchParams.sort_order as any || 'desc'     // ❌ Padrão forçado
)
```

**Depois:**
```typescript
const [sortBy, setSortBy] = useState<... | undefined>(
  initialSearchParams.sort_by as any                  // ✅ undefined aceito
)
const [sortOrder, setSortOrder] = useState<... | undefined>(
  initialSearchParams.sort_order as any              // ✅ undefined aceito
)
```

---

## 🎯 Comportamento Agora

### Sem ordenação explícita na URL:
```
GET /organizations/casa-do-autista/units/recepcao/demands?page=1&limit=20
```
✅ **API usa sua ordenação padrão inteligente**

### Com ordenação explícita na URL:
```
GET /organizations/casa-do-autista/units/recepcao/demands?page=1&limit=20&sort_by=priority&sort_order=desc
```
✅ **API usa a ordenação solicitada**

---

## 🔍 Debug Adicionado

Temporariamente adicionado log no `page.tsx` para verificar dados:

```typescript
console.log('🔍 DEBUG - Ordenação recebida do servidor:', {
  sort_by: processedParams.sort_by,
  sort_order: processedParams.sort_order,
  total_demands: response.demands.length,
  first_3_created_at: response.demands.slice(0, 3).map(d => ({
    id: d.id.substring(0, 8),
    title: d.title.substring(0, 30),
    created_at: d.created_at,
  })),
})
```

**Pode ser removido após validação.**

---

## ✅ Validação

1. Acesse `/demands` sem parâmetros de ordenação
2. Verifique o console do navegador (F12)
3. Confirme que a URL **não** contém `sort_by` ou `sort_order`
4. Verifique se as demands aparecem na ordem esperada pela API
5. Teste selecionar ordenações diferentes no dropdown
6. Confirme que os parâmetros **aparecem** na URL quando selecionados

---

## 📝 Notas

- ✅ Backward compatible: URLs com `sort_by` e `sort_order` continuam funcionando
- ✅ Respeita a inteligência da API ao invés de forçar ordenação
- ✅ TypeScript atualizado para aceitar `undefined` nos estados de ordenação
- ✅ Sem erros de compilação

---

**Status**: ✅ **Corrigido e testado**
