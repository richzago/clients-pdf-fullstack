# Front-end — Clients PDF Fullstack

> Interface web para gerenciamento de clientes e contatos, desenvolvida em **React, TypeScript, Vite e styled-components**, com autenticação, formulários validados, dashboard responsivo e testes automatizados.

[← README principal](../README.md) · [Documentação da API](../back-end/README.md) · [Código do Front-end](src/)

---

## Sumário

- [Visão geral](#visão-geral)
- [Stack e evolução técnica](#stack-e-evolução-técnica)
- [Funcionalidades e telas](#funcionalidades-e-telas)
- [Arquitetura de componentes](#arquitetura-de-componentes)
- [Instalação e execução](#instalação-e-execução)
- [Navegação e autenticação](#navegação-e-autenticação)
- [Formulários e validações](#formulários-e-validações)
- [Dashboard e contatos](#dashboard-e-contatos)
- [Edição parcial e exclusão](#edição-parcial-e-exclusão)
- [Design e responsividade](#design-e-responsividade)
- [Testes automatizados](#testes-automatizados)
- [Integração com a API](#integração-com-a-api)
- [Limitações e melhorias futuras](#limitações-e-melhorias-futuras)

## Visão geral

O Front-end do **Clients PDF Fullstack** permite criar uma conta, autenticar-se e administrar contatos em uma interface visual integrada à API REST do projeto.

A aplicação utiliza páginas React, rotas com React Router, formulários controlados pelo React Hook Form, validações Yup e um contexto compartilhado para autenticação e operações de clientes/contatos.

O dashboard foi reorganizado para evitar que o número de contatos faça a página crescer indefinidamente: seus cards aparecem em uma lista com rolagem interna e as ações Edit/Delete são apresentadas junto de cada registro.

> **Sobre PDF:** a geração de relatórios já existe na API, mas **não há botão de exportação no Front-end atual**. Consulte o [guia do Back-end](../back-end/README.md#relatório-pdf) para o endpoint `GET /clients/relatory`.

## Stack e evolução técnica

| Tecnologia | Finalidade |
| --- | --- |
| React 18 | Componentes e renderização |
| TypeScript 5 | Tipagem dos dados e propriedades |
| Vite 8 | Servidor de desenvolvimento e build |
| React Router 7 | Navegação e rotas protegidas |
| styled-components 5 | CSS organizado por componente |
| React Hook Form | Formulários, valores, dirtyFields, estado de submissão |
| Yup e @hookform/resolvers | Validação de cadastro |
| Axios | Comunicação HTTP |
| react-hot-toast | Notificações de sucesso/erro |
| react-icons | Ícones |
| Vitest | Executor de testes |
| React Testing Library | Testes de interação e DOM |
| jsdom | Ambiente de DOM simulado |
| Axios Mock Adapter | Respostas HTTP simuladas |

A aplicação foi originalmente criada com **Create React App** e passou por atualização para **Vite**, revisão de dependências, modernização da navegação, organização do estado e expansão dos testes. O objetivo foi preservar a lógica existente e reduzir problemas sem uma reescrita completa.

Os scripts e versões em uso podem ser consultados em [`package.json`](package.json).

## Funcionalidades e telas

### /login — autenticação

- Entrada de e-mail e senha.
- Exibição/ocultação de senha através de botão acessível.
- Requisição `POST /login`.
- Armazenamento do JWT recebido na chave `@TOKEN` do `localStorage`.
- Redirecionamento para `/dashboard` após o login.
- Notificação em caso de credenciais inválidas.

### /clients — cadastro de cliente

- Nome, telefone, e-mail e senha.
- Formulário com rótulos e mensagens de erro.
- Validação local usando Yup.
- Requisição `POST /clients`.
- Navegação de volta para login.

### /dashboard — área autenticada

O dashboard contém:

1. Cabeçalho e identificação da página.
2. Botão **Logout**.
3. Formulário de **Register Contact**.
4. Card **Your account**, com os dados e ações do cliente.
5. Painel **Contacts**, com listagem, edição e exclusão.

Em telas mais largas, cadastro/perfil e contatos aparecem em colunas. Em telas menores, as seções passam para uma coluna.

**Search Contacts!** abre ou fecha a listagem e busca novamente os registros ao abri-la. A criação de contatos já chama uma nova listagem após o POST, de modo que os dados do contexto são atualizados sem recarregar a página. Na branch consultada para esta documentação, a listagem **não é aberta automaticamente ao entrar no dashboard**; esse comportamento foi planejado em uma rodada de estabilização separada.

### Rotas protegidas

`ProtectedRoutes` verifica `isAuthenticated`, disponibilizado pelo `AuthContext`, antes de renderizar o dashboard.

Essa restrição melhora a navegação do cliente, porém **a segurança efetiva é aplicada no Back-end**, que valida o JWT nas rotas privadas.

## Arquitetura de componentes

~~~text
src/
├── __tests__/
│   ├── components/
│   └── utils/
├── components/
│   ├── ProtectedRoutes/
│   ├── dashboard/
│   │   ├── client/          # Perfil e operações da conta
│   │   ├── contact/         # Cards, listagem e ações
│   │   └── logout/
│   ├── forms/
│   │   ├── formClient/      # Cadastro de cliente
│   │   ├── formContact/     # Cadastro de contato
│   │   ├── loginClient/     # Login
│   │   ├── updateClient/   # PATCH de cliente
│   │   ├── updateContact/  # PATCH de contato
│   │   └── updateShared/   # Estilos dos formulários de edição
│   ├── header/
│   └── ui/
│       └── Modal/
│           └── ConfirmDialog/
├── contexts/
│   └── AuthContext.tsx
├── interfaces/
│   └── client.ts
├── pages/
│   ├── clientDashboard/
│   ├── clientLoginPage.tsx
│   └── clientRegistrationPage.tsx
├── routes/
│   └── index.tsx
├── services/
│   └── api.ts
├── validations/
│   └── validationRegister.ts
├── App.tsx
├── index.css
├── index.tsx
└── setupTests.ts
~~~

### Responsabilidades principais

| Arquivo/área | Responsabilidade |
| --- | --- |
| `pages/` | Compor as telas usando componentes existentes |
| `routes/index.tsx` | Declarar caminhos públicos e privados |
| `contexts/AuthContext.tsx` | Estado e operações de autenticação, clientes e contatos |
| `services/api.ts` | Instância do Axios |
| `forms/` | Campos, validações e submissão |
| `dashboard/` | Exibição dos registros e ações |
| `ui/Modal` | Janela reutilizável para edição/confirmar exclusão |
| `interfaces/client.ts` | Tipos TypeScript dos registros |
| `validations/validationRegister.ts` | Schemas Yup da interface |
| `__tests__/` | Testes de interação e integração da UI |

## Instalação e execução

### Requisitos

- Node.js/npm compatíveis com o Vite 8 e dependências instaladas (recomenda-se Node LTS recente).
- Back-end configurado e em execução.
- Porta `3000` livre para o Vite.
- API disponível em `http://localhost:3005`, ou URL atualizada no serviço Axios.

A partir da raiz do repositório:

~~~bash
cd front-end
npm ci
npm run dev
~~~

Acesse `http://localhost:3000`.

### Scripts

| Comando | Ação |
| --- | --- |
| `npm run dev` | Inicia Vite em desenvolvimento |
| `npm start` | Alias do comando Vite |
| `npm run build` | Executa TypeScript e gera o build |
| `npm run preview` | Visualiza o build local na porta 3000 |
| `npm test` | Executa Vitest em modo interativo |
| `npm run test:run` | Executa testes uma vez |

A configuração do Vite encontra-se em `vite.config.mts`:

~~~typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
});
~~~

O `strictPort` impede troca silenciosa de porta caso a 3000 já esteja em uso.

### Executar Back-end e Front-end

Utilize **dois terminais**, um em `back-end` e outro em `front-end`:

~~~text
Terminal A: cd back-end  -> npm run dev    (PORT=3005 no .env)
Terminal B: cd front-end -> npm run dev    (http://localhost:3000)
~~~

Para instalação e migrações do PostgreSQL, veja o [guia da API](../back-end/README.md#preparar-o-ambiente).

## Navegação e autenticação

O `AuthProvider` é montado dentro do `BrowserRouter` no ponto de entrada (`src/index.tsx`), disponibilizando estado compartilhado às telas e componentes.

O fluxo de login é:

~~~text
LoginClient
  -> clientLogin(dados)
  -> POST /login
  -> localStorage.setItem("@TOKEN", token)
  -> setIsAuthenticated(true)
  -> navigate("/dashboard")
~~~

O token é utilizado no header:

~~~http
Authorization: Bearer SEU_TOKEN
~~~

Ao fazer logout, o Front-end remove o token, atualiza `isAuthenticated` e navega para `/login`.

**Segurança:** a proteção visual da rota não substitui verificação JWT do Back-end. O armazenamento atual do token em `localStorage` também deve ser reavaliado antes de uma publicação em produção.

## Formulários e validações

### Cadastro de cliente

`schemaClientRegister` exige:

- Nome obrigatório, mínimo de 4 caracteres no Front-end.
- E-mail obrigatório e em formato válido.
- Telefone obrigatório.
- Senha obrigatória.

### Cadastro de contato

`schemaContactRegister` exige:

- Nome obrigatório, mínimo de 4 caracteres.
- E-mail válido e obrigatório.
- Telefone obrigatório.

Os campos possuem `label` associados e mensagens de erro renderizadas próximas ao input, com atributos como `aria-invalid` e `aria-describedby`.

**Importante:** o Back-end possui regras mais completas. Por exemplo, exige senha de no mínimo 8 caracteres e valida limites/formato do telefone. Logo, passar na validação do Front-end **não garante aprovação do servidor**. A API permanece como fonte de verdade.

### Formulários de edição

Os componentes de atualização utilizam `React Hook Form` com `dirtyFields`.

~~~typescript
if (dirtyFields.email) {
  const email = data.email.trim();

  if (email && email !== contact.email) {
    changes.email = email;
  }
}
~~~

A ideia é enviar somente campos modificados, não vazios e diferentes do valor original. Se não há alteração válida, o formulário não envia PATCH.

O botão Update utiliza `isSubmitting` para sinalizar a operação e prevenir novos envios simultâneos.

## Dashboard e contatos

A página do dashboard organiza os componentes por um `DashboardGrid`.

No desktop, a barra lateral contém cadastro e perfil; o painel principal contém os contatos.

Para telas menores, a regra `@media` modifica o Grid para uma coluna.

### Cards e rolagem

A lista de contatos utiliza uma combinação de Grid e rolagem vertical:

~~~css
.contacts-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, 240px), 1fr)
  );

  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}
~~~

Isso permite distribuir cards em colunas, aproveitando a largura disponível, e limita o crescimento da lista quando há muitos contatos.

**Limitação:** a rolagem resolve a apresentação, mas não a quantidade de registros transferidos pela API. Para volume elevado de dados, paginação e filtros no servidor seriam melhorias futuras.

### Atualização da listagem

A criação de contatos acontece no contexto:

~~~text
FormContactRegister
  -> contactRegister()
  -> POST /contacts
  -> listContacts()
  -> GET /contacts
  -> setContacts(novosDados)
  -> DashboardContact renderiza novamente
~~~

As edições também recarregam os dados por `onUpdated={listContacts}` depois de um PATCH bem-sucedido. A exclusão bem-sucedida remove o contato do estado por `setContacts`.

O botão **Search Contacts!** permanece como mecanismo manual para consultar/mostrar os contatos. Na versão auditada, a busca inicial é acionada quando a lista é aberta.

## Edição parcial e exclusão

### Modal de edição

- O usuário escolhe um cliente ou contato.
- O dashboard guarda o registro selecionado em estado local.
- O componente `Modal` mostra o formulário com dados originais.
- O PATCH envia apenas os campos modificados.
- Após sucesso, a lista é atualizada e o modal fecha.
- Durante uma atualização, `onBusyChange` comunica o estado de envio para evitar fechamento acidental.

O modal compartilhado inclui título acessível, fechamento pela tecla Escape, controle do foco e bloqueio de rolagem do fundo enquanto está aberto.

### Exclusão com confirmação

A exclusão não é realizada diretamente no primeiro clique.

~~~text
Delete Contact
    |
    v
ConfirmDialog (mostra nome do registro)
    |
    +--> Cancel: nenhuma chamada DELETE
    |
    +--> Confirm: DELETE /contacts/:id
                       |
                       +--> sucesso: fecha modal / atualiza lista
                       |
                       +--> falha: modal aberto / mensagem de erro
~~~

O mesmo padrão é utilizado para exclusão do cliente, que encerra a sessão após sucesso.

Essa abordagem reduz exclusões acidentais e mantém a interface consistente.

## Design e responsividade

A modernização visual buscou um estilo administrativo **dark, simples e consistente**.

Escolhas recorrentes:

- Fundo principal em azul-escuro (`#0f172a`).
- Superfícies de cards em tons próximos de `#111c31`.
- Azul em ações principais (`#2563eb`).
- Texto principal claro e texto secundário em cinza-azulado.
- Campos de largura completa, com contornos de foco visíveis.
- Componentes de formulário organizados por `flex` e `gap`.
- Layout principal com `CSS Grid`.
- CSS em arquivos `style.ts` usando styled-components, sem framework visual adicional.

### Breakpoints

O dashboard passa a uma coluna em larguras mais estreitas (regra em `pages/clientDashboard/style.ts`); formulários e cards recebem ajustes para telas pequenas. A adaptação real deve ser testada no navegador e não apenas em jsdom.

## Testes automatizados

O projeto usa **Vitest + React Testing Library + jsdom**.

~~~bash
npm run test:run
~~~

Para modo interativo:

~~~bash
npm test
~~~

Para compilar e confirmar tipagem:

~~~bash
npm run build
~~~

### Organização da suíte

Os testes em `src/__tests__/components/` incluem:

| Arquivos/categoria | Cenários de exemplo |
| --- | --- |
| `authLogin` / `clientLogin` | Requisições de login e autenticação |
| `clientRegister` / `clientRegisterInterface` | Cadastro, rótulos e erros |
| `contactRegister` / `contactRegisterInterface` | Cadastro e validações |
| `contactAutoRefresh` | POST seguido de GET e atualização da lista |
| `protectedRoutes` | Renderização de conteúdo privado |
| `dashboardLayout` | Seções e listagem de múltiplos contatos |
| `dashboardEditModal` | Abertura, seleção de registro e atualização |
| `dashboardDelete` / `authDelete` | Confirmação de exclusão e chamadas DELETE |
| `updateClient` / `updateContact` | PATCH parcial, ausência de alteração, erros |
| `header` / `loginInterface` | Estrutura e acessibilidade básica |

Mocks de contexto podem ser criados por `createMockAuthContext`. Chamadas à API são simuladas com `axios-mock-adapter` quando necessário.

### O que os testes não comprovam

- Layout exato, cores e rolagem em navegadores reais.
- Comportamento em dispositivos específicos.
- Integração real com PostgreSQL.
- Geração de PDF com Chromium.
- Segurança da aplicação em produção.

Esses cenários devem ser complementados por testes manuais ou E2E caso o projeto evolua.

## Integração com a API

A instância Axios está em `src/services/api.ts`:

~~~typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3005",
  timeout: 5000,
});

export default api;
~~~

Se mudar a porta ou o host do Back-end, atualize `baseURL`. Ainda não há configuração via `VITE_API_URL` no código auditado.

### Fluxos HTTP principais

| Ação no Front-end | Requisição |
| --- | --- |
| Criar conta | `POST /clients` |
| Login | `POST /login` |
| Ver perfil | `GET /clients` |
| Atualizar perfil | `PATCH /clients/:id` |
| Excluir conta | `DELETE /clients/:id` |
| Criar contato | `POST /contacts` |
| Exibir contatos | `GET /contacts` |
| Atualizar contato | `PATCH /contacts/:id` |
| Excluir contato | `DELETE /contacts/:id` |

**Não há chamada ao endpoint PDF na interface atual.** Para exportar use `GET /clients/relatory` diretamente pela API.

## Limitações e melhorias futuras

- Carregar/exibir automaticamente a lista de contatos ao entrar no dashboard, preservando atualização manual (se essa melhoria não tiver sido incorporada à branch consultada).
- Botão de download do relatório PDF.
- Paginação, busca e filtros para grandes listas.
- Mensagens e estados de loading mais consistentes nas operações de rede.
- Centralização da URL da API em variável de ambiente do Vite.
- Melhor tratamento de tokens expirados e de falhas na API.
- Fortalecimento da segurança de sessão para ambientes públicos.
- Capturas reais da interface, pipeline de CI e deploy demonstrativo.

---

**Desenvolvido por [Richard Zago](https://github.com/richzago)** · [Visão geral](../README.md) · [API / PostgreSQL / PDF](../back-end/README.md)
