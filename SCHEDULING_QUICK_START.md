# 🚀 Guia Rápido - Sistema de Agendamento

## ✨ O que mudou?

A página de **Registro de Demanda** agora possui um sistema de agendamento completo que substitui os campos de endereço.

## 🎯 Como Usar

### 1️⃣ Preencha os Dados Básicos
```
✏️ Título da consulta
📝 Descrição da solicitação
```

### 2️⃣ Selecione o Cargo
- Marque o checkbox do cargo desejado (ex: Médico, Enfermeiro, Psicólogo)
- ⚠️ Apenas um cargo pode ser selecionado por vez

### 3️⃣ Visualize a Agenda
Após selecionar o cargo, você verá:

```
┌─────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  Hora   │ Dom │ Seg │ Ter │ Qua │ Qui │ Sex │ Sáb │
├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  08:00  │ 🟢  │ 🟢  │ ⚪  │ 🟢  │ ⚪  │ 🟢  │ ⚪  │
│  08:30  │ 🟢  │ ⚪  │ ⚪  │ 🟢  │ 🟢  │ 🟢  │ ⚪  │
│  09:00  │ 🟢  │ 🟢  │ 🟢  │ ⚪  │ 🟢  │ ⚪  │ ⚪  │
│   ...   │ ... │ ... │ ... │ ... │ ... │ ... │ ... │
└─────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

**Legenda:**
- 🟢 **Verde** = Disponível (clique para selecionar)
- ⚪ **Cinza** = Indisponível
- 🔵 **Azul** = Selecionado

### 4️⃣ Selecione o Horário
- Clique em um slot **verde** (disponível)
- Passe o mouse para ver qual profissional está disponível
- O slot ficará **azul** quando selecionado

### 5️⃣ Registre a Consulta
- O botão será habilitado após selecionar um horário
- Clique em "Registrar Consulta"

## 🎨 Recursos Visuais

### Navegação de Semanas
```
[←] [Hoje] [→]
```
- **← Anterior**: Semana anterior
- **Hoje**: Volta para semana atual
- **→ Próxima**: Próxima semana

### Informações de Disponibilidade
- **Badge com número**: Quantos profissionais disponíveis
- **Tooltip ao passar mouse**: Nome do(s) profissional(is)
- **Lista abaixo**: Todos os profissionais disponíveis

## ⚙️ Configurações

### Horários
- **Das:** 08:00
- **Até:** 18:00
- **Intervalo:** 30 minutos

### Dias
- **Exibição:** Domingo a Sábado
- **Navegação:** Por semana

## 🔍 Exemplo Prático

### Cenário: Agendar consulta com Psicólogo

1. **Título:** Primeira consulta psicológica
2. **Descrição:** Avaliação inicial do paciente João Silva
3. **Cargo:** ☑️ Psicólogo
4. **Horário:** Terça-feira, 10h30 (clique no slot verde)
5. **Confirmar:** Clique em "Registrar Consulta"

## 📱 Interface Mobile

A agenda é responsiva e funciona em:
- 📱 Celulares
- 📱 Tablets
- 💻 Desktop

**Dica:** Em telas menores, role horizontalmente para ver todos os dias

## ❓ FAQ

**P: Por que a agenda não aparece?**
R: Você precisa selecionar um cargo primeiro.

**P: Todos os slots estão cinza, por quê?**
R: Nenhum profissional do cargo selecionado está disponível nessa semana. Tente navegar para outra semana.

**P: Posso selecionar vários horários?**
R: Não, apenas um horário por demanda. Para criar múltiplas demandas, repita o processo.

**P: Posso mudar o cargo depois de selecionar?**
R: Sim! Desmarque o cargo atual e selecione outro. A agenda será atualizada.

**P: O que significa o número no badge?**
R: É a quantidade de profissionais disponíveis naquele horário.

## 🎯 Dicas

1. **Planeje com antecedência**: Navegue pelas próximas semanas para encontrar o melhor horário
2. **Veja quem está disponível**: Passe o mouse sobre os slots verdes
3. **Use "Hoje"**: Volte rapidamente para a semana atual
4. **Verifique a descrição**: Cada cargo pode ter requisitos específicos

## 🚨 Observações Importantes

- ⚠️ Selecione o cargo ANTES de ver a agenda
- ⚠️ Um horário DEVE ser selecionado para continuar
- ⚠️ A disponibilidade é em tempo real
- ⚠️ Horários mostrados são baseados nos dias de trabalho configurados

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se todos os campos estão preenchidos
2. Tente atualizar a página
3. Entre em contato com o administrador do sistema

---

**Data de criação:** 19/10/2025  
**Versão:** 1.0.0
