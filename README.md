# Clients PDF Fullstack

> Aplicação Full Stack de gestão de clientes e contatos, com autenticação JWT, API REST, dashboard responsivo, operações CRUD e geração de relatórios em PDF pelo Back-end.

**Autor:** [Richard Zago](https://github.com/richzago) · **Tecnologias:** TypeScript · Node.js · Express · TypeORM · PostgreSQL · React · Vite · styled-components

[Guia da API](back-end/README.md) • [Guia do Front-end](front-end/README.md) • [Código-fonte](https://github.com/richzago/clients-pdf-fullstack)

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Organização do repositório](#organização-do-repositório)
- [Instalação e execução](#instalação-e-execução)
- [Como utilizar](#como-utilizar)
- [API REST](#api-rest)
- [Geração de PDF](#geração-de-pdf)
- [Testes](#testes)
- [Segurança e decisões de projeto](#segurança-e-decisões-de-projeto)
- [Histórico de modernização](#histórico-de-modernização)
- [Próximos passos](#próximos-passos)
- [Autoria](#autoria)

## Sobre o projeto

O **Clients PDF Fullstack** permite criar uma conta de cliente e gerenciar contatos associados a ela. É um projeto de desenvolvimento Full Stack que demonstra, na prática, o uso de uma **API REST com autenticação e banco de dados relacional** integrada a uma interface React.

O cadastro de clientes inclui nome, e-mail, telefone e senha. Depois do login, o usuário pode consultar e editar sua conta, adicionar contatos, visualizar seus registros, alterá-los e excluí-los. O relacionamento é de **um cliente para muitos contatos**; a API filtra os registros pelo cliente autenticado.

A API inclui uma funcionalidade adicional de **relatório em PDF**, gerado com dados do cliente autenticado e contatos relacionados. Essa capacidade existe **no Back-end**, no endpoint autenticado `GET /clients/relatory`; **não há um botão dedicado à exportação no dashboard web atual**.

O projeto foi atualizado e revisado em 2026 com atenção à segurança dos endpoints, validações, dependências, testes e apresentação visual.

## Funcionalidades

### Cliente / conta

- Cadastro de clientes, com verificação de e-mail já existente.
- Login com JWT e expiração de token em 24 horas.
- Visualização da conta autenticada.
- Atualização parcial de nome, e-mail e telefone pela interface.
- Alteração de senha disponível na API, com confirmação da senha atual.
- Exclusão da própria conta, com confirmação no dashboard.
- Encerramento de sessão por logout.

### Contatos

- Cadastro de múltiplos contatos vinculados à conta.
- Listagem de contatos pertencentes ao cliente autenticado.
- Edição de campos específicos via PATCH (sem reenviar campos não modificados).
- Exclusão individual com confirmação.
- Atualização da lista após cadastro e edição; remoção do card após exclusão bem-sucedida.
- Listagem em cards com rolagem interna para evitar o crescimento ilimitado da página.

### Interface e experiência

- Telas de login e cadastro de conta.
- Dashboard com áreas de cadastro, perfil e contatos.
- Layout dark mode e adaptação para telas menores.
- Campos com rótulos, validações Yup, mensagens de erro e feedback com toast.
- Modais para editar e confirmar exclusão.
- Abertura/recarregamento da lista pelo botão **Search Contacts!**. Na branch auditada para esta documentação, a busca inicial ainda depende do botão; o novo contato já aparece automaticamente **se a lista estiver aberta**. Carregamento automático ao entrar no dashboard é uma melhoria separada, discutida durante a evolução do projeto.

### API e relatórios

- Endpoints REST para criar, consultar, atualizar e excluir clientes e contatos.
- Validação de payloads e tratamento de erros.
- Autenticação para as operações privadas.
- Relatório PDF A4 com informações do cliente e contatos, produzido com Puppeteer.

## Tecnologias

| Área | Ferramentas | Responsabilidade |
| --- | --- | --- |
| Back-end | Node.js, TypeScript, Express 4 | API REST |
| Banco de dados | PostgreSQL, TypeORM 0.3 | Entidades, relações, migrações e consultas |
| Segurança | JWT, bcryptjs | Tokens e hash de senhas |
| Validação | Yup | Regras de entrada da API |
| PDF | Puppeteer | HTML para PDF |
| Front-end | React 18, TypeScript 5, Vite 8 | Interface SPA |
| Rotas | React Router 7 | Navegação e rotas protegidas |
| Formulários | React Hook Form, Yup | Controle de campos e validação |
| Estilos | styled-components 5 | CSS por componente |
| HTTP | Axios | Integração com Back-end |
| Feedback | react-hot-toast, react-icons | Notificações e ícones |
| Testes API | Jest, Supertest, SQLite em memória | Testes de integração |
| Testes Web | Vitest, Testing Library, jsdom, Axios Mock Adapter | Testes de componentes e integração da interface |

Versões exatas e scripts ficam em [`back-end/package.json`](back-end/package.json) e [`front-end/package.json`](front-end/package.json).

## Arquitetura

~~~text
       React / Vite (navegador)
                  |
              Axios / HTTP
                  |
                  v
          Express / API REST
             |          |
        JWT / Yup     Controllers
                         |
                       Services
                         |
                       TypeORM
                         |
                      PostgreSQL

GET /clients/relatory (JWT)
  -> consulta cliente + contatos
  -> gera HTML
  -> Puppeteer
  -> PDF A4 (application/pdf)
~~~

A API separa rotas, middlewares, controllers, services, entidades e validações. O Front-end separa páginas, componentes, contexto de autenticação, formulários, rotas e serviço de requisições.

**Modelo de dados:** `Client (1) -> (N) Contact`. A tabela `contacts` guarda a referência `clientId`. A remoção de um cliente provoca exclusão em cascata de seus contatos.

**Restrição de dados:** os e-mails de clientes são únicos; os e-mails dos contatos também têm restrição de unicidade **global**, conforme a entidade/migração atual.

## Organização do repositório

~~~text
clients-pdf-fullstack/
├── README.md
├── back-end/
│   ├── README.md
│   ├── .env.example
│   ├── package.json
│   ├── jest.config.ts
│   └── src/
│       ├── __tests__/          # Jest + Supertest
│       ├── controllers/
│       ├── data-source.ts
│       ├── entities/
│       ├── interfaces/
│       ├── middlewares/
│       ├── migrations/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       ├── utils/              # Geração de PDF
│       ├── app.ts
│       └── server.ts
└── front-end/
    ├── README.md
    ├── package.json
    ├── index.html
    ├── vite.config.mts
    ├── vitest.config.mts
    ├── public/
    └── src/
        ├── __tests__/          # Vitest / Testing Library
        ├── components/
        ├── contexts/
        ├── interfaces/
        ├── pages/
        ├── routes/
        ├── services/
        ├── validations/
        ├── App.tsx
        ├── index.tsx
        └── index.css
~~~

Os três READMEs têm funções diferentes: **visão geral aqui**, referência de endpoints/configuração no [Back-end](back-end/README.md) e explicação de telas/componentes/testes no [Front-end](front-end/README.md).

## Instalação e execução

### Pré-requisitos

- Git.
- Node.js e npm atuais e compatíveis com as dependências do projeto; recomenda-se uma versão LTS recente.
- PostgreSQL instalado, com serviço iniciado e acesso para criar um banco.
- Para gerar PDF, o ambiente deve permitir a execução do Chromium utilizado pelo Puppeteer.

**Atenção:** existem `package.json` separados em `back-end` e `front-end`. Os comandos de instalação devem ser executados em cada diretório.

### 1. Clonar

~~~bash
git clone https://github.com/richzago/clients-pdf-fullstack.git
cd clients-pdf-fullstack
~~~

Durante a modernização, as alterações foram desenvolvidas na branch `feat/Upgrade2026`. Se ela ainda não tiver sido promovida à branch principal, selecione-a com:

~~~bash
git switch feat/Upgrade2026
~~~

### 2. Back-end

~~~bash
cd back-end
npm install
~~~

Copie `.env.example` para `.env` (no PowerShell, `Copy-Item .env.example .env`). Crie previamente o banco de dados PostgreSQL.

Exemplo de ambiente **local**, compatível com a URL do Axios:

~~~dotenv
SECRET_KEY=escolha-um-segredo-longo-e-aleatorio
PORT=3005
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_local
POSTGRES_DB_NAME=clients_pdf
POSTGRES_DB_PORT=5432
~~~

Execute as migrações:

~~~bash
npm run typeorm -- migration:run -d src/data-source.ts
~~~

Inicie a API:

~~~bash
npm run dev
~~~

A API estará em `http://localhost:3005` se o banco estiver acessível e `PORT=3005`. O servidor usa `PORT || 3000`, mas a interface espera **3005** por padrão.

> Nunca inclua dados reais de ambiente no repositório. O `.env` do Back-end já é ignorado pelo Git.

### 3. Front-end (em outro terminal)

A partir da raiz do repositório:

~~~bash
cd front-end
npm ci
npm run dev
~~~

Acesse **http://localhost:3000**. O Vite usa a porta 3000 com `strictPort: true`. O Axios está configurado em `front-end/src/services/api.ts` para `http://localhost:3005`; caso altere a porta da API, atualize esse arquivo.

| Aplicação | Porta local | Comando |
| --- | --- | --- |
| API | 3005 (via `.env`) | `cd back-end && npm run dev` |
| Web | 3000 (Vite) | `cd front-end && npm run dev` |

> O repositório auditado é voltado para execução local. Publicar em produção exige configuração adicional de variáveis, HTTPS, CORS restrito, banco de produção e dependências de sistema do Puppeteer. Não há Docker ou pipeline de deploy configurado no repositório auditado.

## Como utilizar

1. Entre na página de cadastro (`/clients`) e crie uma conta.
2. Faça login em `/login` com e-mail e senha.
3. No dashboard (`/dashboard`), cadastre um contato.
4. Abra a seção **Search Contacts!** para consultar seus registros.
5. Utilize **Edit Contact** para atualizar dados pelo modal.
6. Utilize **Delete Contact** para excluir após confirmação.
7. Abra **Client** para consultar, editar ou excluir a própria conta.
8. Utilize **Logout** para encerrar a sessão no navegador.

No Front-end atual, o JWT é armazenado em `localStorage` na chave `@TOKEN`. Trata-se de uma decisão da implementação existente, e não de uma recomendação de segurança universal para aplicações de produção.

## API REST

Base local: `http://localhost:3005`

| Método | Endpoint | JWT | Descrição |
| --- | --- | --- | --- |
| POST | `/clients` | Não | Criar cliente |
| POST | `/login` | Não | Autenticar; retorna token |
| GET | `/clients` | Sim | Consultar a conta autenticada |
| PATCH | `/clients/:id` | Sim | Atualizar campos do cliente |
| DELETE | `/clients/:id` | Sim | Excluir a conta autenticada |
| GET | `/clients/relatory` | Sim | Baixar relatório PDF |
| POST | `/contacts` | Sim | Criar contato vinculado à conta |
| GET | `/contacts` | Sim | Listar contatos próprios |
| PATCH | `/contacts/:id` | Sim | Atualizar contato |
| DELETE | `/contacts/:id` | Sim | Excluir contato |

**Cadastro de cliente:**

~~~http
POST /clients
Content-Type: application/json

{
  "name": "Cliente Exemplo",
  "email": "cliente@email.com",
  "telephone": "51999999999",
  "password": "SenhaForte123"
}
~~~

**Login:**

~~~http
POST /login
Content-Type: application/json

{
  "email": "cliente@email.com",
  "password": "SenhaForte123"
}
~~~

**Resposta ilustrativa:**

~~~json
{"token": "<JWT>"}
~~~

**Atualização parcial de contato:**

~~~http
PATCH /contacts/UUID_DO_CONTATO
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{"telephone": "51988888888"}
~~~

Para payloads, validações e erros, consulte a [referência técnica da API](back-end/README.md).

## Geração de PDF

A geração é implementada no **Back-end**:

- Rota: `back-end/src/routes/clients.routes.ts`
- Controller: `back-end/src/controllers/clients/client.controller.ts`
- Consulta: `back-end/src/services/clients/listClientsRelatory.service.ts`
- HTML: `back-end/src/utils/generateHTML.ts`
- Conversão com Puppeteer: `back-end/src/utils/convertToPDF.ts`

**Endpoint:**

~~~http
GET /clients/relatory
Authorization: Bearer SEU_TOKEN
~~~

O PDF utiliza formato A4 e é retornado com `Content-Type: application/pdf` e `Content-Disposition: attachment; filename="relatorio-clientes.pdf"`.

**Baixar no PowerShell:**

~~~powershell
curl.exe -H "Authorization: Bearer SEU_TOKEN" "http://localhost:3005/clients/relatory" -o "relatorio-clientes.pdf"
~~~

**Importante:** a interface web ainda não possui um botão de exportação. O download pode ser feito por requisição autenticada, como no exemplo, e depende de o Chromium do Puppeteer funcionar no ambiente.

## Testes

### API: Jest + Supertest

~~~bash
cd back-end
npm test
~~~

Durante testes (`NODE_ENV=test`), o TypeORM usa **SQLite em memória**, enquanto a aplicação local usa PostgreSQL. Os testes de integração cobrem rotas de clientes/contatos, autenticação, listagem, atualizações e exclusões. O conversor de PDF é simulado nos testes de integração existentes; isso **não comprova a execução real do Chromium**.

### Front-end: Vitest + Testing Library

~~~bash
cd front-end
npm run test:run
npm run build
~~~

O build inclui `tsc --noEmit`. Há testes para login, cadastro, rotas protegidas, atualização parcial, modais, confirmação de exclusão, layout do dashboard e atualização da lista após cadastro. Axios Mock Adapter permite testar chamadas HTTP sem iniciar o servidor.

Não são anunciadas porcentagens de cobertura nem status de CI: esses valores não foram medidos/publicados na branch auditada. Execute os comandos para validar seu ambiente.

## Segurança e decisões de projeto

- Senhas são convertidas em hash com **bcryptjs** antes do armazenamento.
- JWT com validade configurada para 24 horas.
- Rotas privadas usam middleware de autenticação.
- Payloads são validados pelo Yup, incluindo verificações para impedir alterações em campos imprevistos.
- Consultas e mutações de contatos verificam a conta autenticada.
- A restrição UNIQUE de e-mail de contato é global no banco.
- A tabela de contatos utiliza relacionamento com remoção em cascata ao excluir o cliente.
- No PATCH da interface, apenas campos alterados e não vazios são enviados.

**Itens a fortalecer antes de produção:** revisar o uso do parâmetro `:id` na exclusão de cliente (o controller utiliza a identidade do token), sanitizar/escapar valores interpolados no HTML do PDF, melhorar expiração de sessão, configurar CORS e URL da API por ambiente, além de revisar armazenamento de token.

## Histórico de modernização

A evolução do projeto incluiu estabilização do CRUD e da autenticação, ajustes de validação, atualização de dependências, migração do antigo Front-end para Vite, suíte de testes Vitest, melhorias de formulários, atualização visual em dark mode, layout responsivo, cards de contato com rolagem interna, modais de edição e confirmação de exclusão.

As alterações foram trabalhadas de forma incremental, preservando a aplicação e verificando regressões a cada etapa.

## Próximos passos

- Botão **Exportar PDF** no dashboard.
- Carregamento automático da lista ao entrar no dashboard (caso ainda não esteja aplicado na versão consultada).
- Paginação e busca no servidor quando o número de contatos crescer.
- Tratamento mais completo de expiração de sessão e erros de rede.
- Configuração da URL do Back-end por ambiente.
- Reforço de segurança para publicação pública.
- Capturas reais do dashboard, deploy demonstrativo e testes em CI.

## Autoria

**Richard Zago** — Desenvolvedor Full Stack com foco em Back-end.

GitHub: [github.com/richzago](https://github.com/richzago)  
Repositório: [github.com/richzago/clients-pdf-fullstack](https://github.com/richzago/clients-pdf-fullstack)

Projeto para prática, evolução técnica e portfólio profissional, com foco em APIs REST, banco de dados relacional, autenticação, testes e integração Full Stack.

---

**Leia também:** [Documentação da API](back-end/README.md) · [Documentação do Front-end](front-end/README.md)
