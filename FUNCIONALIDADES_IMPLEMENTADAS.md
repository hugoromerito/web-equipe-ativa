# Funcionalidades do Backend Implementadas no Frontend

Este documento lista todas as funcionalidades do backend que foram implementadas no frontend da aplicação web-equipe-ativa.

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação (Auth)
- [x] `authenticateWithPasswordRoute` - Login com email/senha (já existia)
- [x] `authenticateWithGoogleRoute` - Login com Google (já existia)
- [x] `getProfileRoute` - Obter perfil do usuário (já existia)
- [x] `requestPasswordRecoverRoute` - Solicitar recuperação de senha ✨ **NOVO**
- [x] `resetPasswordRoute` - Resetar senha ✨ **NOVO**

### 🏢 Organizações (Organizations)
- [x] `createOrganizationRoute` - Criar organização (já existia)
- [x] `getOrganizationRoute` - Obter detalhes da organização (já existia)
- [x] `getOrganizationsRoute` - Listar organizações do usuário (já existia)
- [x] `getMembershipRoute` - Obter membership do usuário (já existia)
- [x] `updateOrganizationRoute` - Atualizar organização (já existia)
- [x] `shutdownOrganizationRoute` - Encerrar organização ✨ **NOVO**

### 🏛️ Setores (Units)
- [x] `createUnitRoute` - Criar setor (já existia)
- [x] `getUnitsRoute` - Listar setores (já existia)

### 👥 Usuários (Users)
- [x] `createUserRoute` - Criar usuário ✨ **NOVO**
- [x] `getUsersRoute` - Listar usuários com paginação e filtros ✨ **NOVO**

### 👤 Membros (Members)
- [x] `getMembersOrganizationRoute` - Listar membros da organização ✨ **NOVO**
- [x] `getMembersUnitRoute` - Listar membros da setor ✨ **NOVO**

### ✉️ Convites (Invites)
- [x] `createInviteRoute` - Criar convite ✨ **NOVO**
- [x] `acceptInviteRoute` - Aceitar convite (já existia)
- [x] `rejectInviteRoute` - Rejeitar convite (já existia)
- [x] `getInviteRoute` - Obter detalhes do convite (já existia)
- [x] `getInvitesRoute` - Listar convites pendentes do usuário ✨ **NOVO**
- [x] `getOrganizationInvitesRoute` - Listar convites da organização ✨ **NOVO**
- [x] `getPendingInvitesRoute` - Listar convites pendentes (já existia)

### 📋 Pacientes (Applicants)
- [x] `createApplicantRoute` - Criar paciente (já existia)
- [x] `getApplicantRoute` - Obter detalhes do paciente (já existia)
- [x] `getApplicantsRoute` - Listar pacientes (já existia)
- [x] `getCheckApplicantRoute` - Verificar se paciente existe por CPF (já existia)
- [x] `getApplicantDemandsRoute` - Listar consultas do paciente ✨ **NOVO**

### 📊 Consultas (Demands)
- [x] `createDemandRoute` - Criar consulta (já existia)
- [x] `getDemandRoute` - Obter detalhes da consulta (já existia)
- [x] `getDemandsRoute` - Listar consultas com filtros (já existia)
- [x] `updateDemandRoute` - Atualizar consulta (título, descrição, prioridade, status) ✨ **NOVO**

### 📎 Anexos (Attachments)
- [x] `uploadUserAvatarRoute` - Upload de avatar do usuário ✨ **NOVO**
- [x] `uploadApplicantAvatarRoute` - Upload de avatar do paciente ✨ **NOVO**
- [x] `uploadOrganizationAvatarRoute` - Upload de avatar da organização ✨ **NOVO**
- [x] `uploadApplicantDocumentRoute` - Upload de documento do paciente ✨ **NOVO**
- [x] `uploadDemandDocumentRoute` - Upload de documento da consulta ✨ **NOVO**
- [x] `uploadOrganizationDocumentRoute` - Upload de documento da organização ✨ **NOVO**
- [x] `getAttachmentsRoute` - Listar anexos com filtros ✨ **NOVO**
- [x] `downloadAttachmentRoute` - Baixar anexo ✨ **NOVO**
- [x] `deleteAttachmentRoute` - Deletar anexo ✨ **NOVO**

## 📁 Arquivos Criados

### HTTP Functions (`src/http/`)
1. `get-members-organization.ts` - Listar membros da organização
2. `get-members-unit.ts` - Listar membros da setor
3. `create-user.ts` - Criar usuário
4. `get-users.ts` - Listar usuários com paginação
5. `get-invites.ts` - Listar convites pendentes
6. `get-organization-invites.ts` - Listar convites da organização
7. `create-invite.ts` - Criar convite
8. `get-applicant-demands.ts` - Listar consultas do paciente
9. `update-demand.ts` - Atualizar consulta completa
10. `shutdown-organization.ts` - Encerrar organização
11. `request-password-recover.ts` - Solicitar recuperação de senha
12. `reset-password.ts` - Resetar senha
13. `upload-user-avatar.ts` - Upload de avatar do usuário
14. `upload-applicant-avatar.ts` - Upload de avatar do paciente
15. `upload-organization-avatar.ts` - Upload de avatar da organização
16. `upload-applicant-document.ts` - Upload de documento do paciente
17. `upload-demand-document.ts` - Upload de documento da consulta
18. `upload-organization-document.ts` - Upload de documento da organização
19. `get-attachments.ts` - Listar anexos
20. `download-attachment.ts` - Baixar anexo
21. `delete-attachment.ts` - Deletar anexo

### Constants (`src/constants/`)
1. `attachment-types.ts` - Tipos e traduções de anexos
2. `demand-constants.ts` - Constantes de consultas (prioridades, status, categorias)

## 🚫 Rotas Ignoradas (AWS)

As seguintes rotas AWS foram ignoradas conforme solicitado:
- Rotas relacionadas a S3
- Rotas relacionadas a serviços específicos da AWS

## 📝 Notas de Implementação

1. **Tipagem Completa**: Todas as funções HTTP possuem interfaces TypeScript completas para requisições e respostas.

2. **Paginação**: Funções de listagem incluem suporte a paginação:
   - `getUsers` - Paginação, busca, filtros e ordenação
   - `getMembers` - Paginação
   - `getAttachments` - Paginação e filtros

3. **Upload de Arquivos**: Todas as funções de upload usam `FormData` para enviar arquivos multipart/form-data.

4. **Filtros e Busca**: 
   - `getUsers` - Busca por nome/email, filtro por role
   - `getAttachments` - Filtro por tipo, consulta, paciente, usuário
   - `getDemands` - Filtros por status, prioridade, categoria (já existia)

5. **Constantes e Traduções**: 
   - Tipos de anexos traduzidos
   - Prioridades, status e categorias de consultas
   - Roles de usuários (já existia)

## 🔄 Próximos Passos

Para utilizar estas funcionalidades na interface:

1. Criar componentes React que consumam estas funções
2. Adicionar hooks do React Query para cache e gerenciamento de estado
3. Implementar páginas de gerenciamento de usuários
4. Implementar páginas de gerenciamento de membros
5. Implementar funcionalidade de upload de arquivos
6. Implementar páginas de recuperação de senha
7. Adicionar funcionalidade de download/visualização de anexos

## 📚 Referências

- Backend Repository: https://github.com/hugoromerito/server-equipe-ativa
- Todas as rotas seguem o padrão da API RESTful do backend
- Autenticação via Bearer Token (JWT)
