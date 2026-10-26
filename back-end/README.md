# Back-end — Clients PDF Fullstack

> **API REST em Node.js, TypeScript, Express, TypeORM e PostgreSQL**, com autenticação JWT, cadastro de clientes e contatos, atualização parcial, controles de autorização, testes de integração e geração de PDF com Puppeteer.

[← README principal](../README.md) · [Front-end](../front-end/README.md) · [Código da API](src/)

---

## Sumário

- [Responsabilidades](#responsabilidades)
- [Tecnologias e arquitetura](#tecnologias-e-arquitetura)
- [Preparar o ambiente](#preparar-o-ambiente)
- [Modelo de dados](#modelo-de-dados)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Referência dos endpoints](#referência-dos-endpoints)
- [Relatório PDF](#relatório-pdf)
- [Validações e tratamento de erros](#validações-e-tratamento-de-erros)
- [Testes automatizados](#testes-automatizados)
- [Organização do código](#organização-do-código)
- [Observações e melhorias futuras](#observações-e-melhorias-futuras)

## Responsabilidades

A API implementa as regras de negócio de contas de clientes e seus contatos, separando a interface HTTP do acesso ao banco de dados e oferecendo:

- Cadastro de cliente com hash de senha e validação de unicidade de e-mail.
- Login com senha e emissão de JWT.
- Consulta dos dados do cliente autenticado e seus contatos.
- Cadastro de contato associado à identidade do token, não a um ID fornecido pelo usuário.
- Edição e exclusão de contatos com verificação de pertencimento.
- PATCH para alterações parciais de cliente e contato.
- Troca de senha do cliente usando `password` e `currentPassword`.
- Relatório em PDF do cliente autenticado e contatos relacionados.
- Testes HTTP automatizados com Jest e Supertest.

## Tecnologias e arquitetura

| Tecnologia | Utilização |
| --- | --- |
| Node.js + TypeScript | Runtime e tipagem |
| Express 4 | Rotas, middlewares e respostas HTTP |
| TypeORM 0.3 | Entidades, relacionamentos, repositórios e migrações |
| PostgreSQL | Persistência em desenvolvimento |
| SQLite em memória | Banco isolado nos testes |
| Yup | Validação de corpos JSON |
| bcryptjs | Hash e verificação de senhas |
| jsonwebtoken | Emissão e verificação de JWT |
| class-transformer | Exclusão de campos sensíveis nas serializações |
| Puppeteer | Renderização de HTML para PDF A4 |
| Jest + ts-jest + Supertest | Testes de integração |

Fluxo lógico:

~~~text
Requisição HTTP
  -> Express Router
  -> Middleware JWT (se necessário)
  -> Middleware UUID (rotas com :id)
  -> Middleware Yup (POST/PATCH)
  -> Controller
  -> Service
  -> Repositório TypeORM
  -> PostgreSQL
  -> Resposta / middleware de erros
~~~

Essa divisão permite manter validações próximas da borda HTTP e regras de persistência nos services.

## Preparar o ambiente

### Pré-requisitos

- Node.js/npm compatíveis com as dependências do projeto.
- PostgreSQL instalado, em execução e com um banco criado.
- Para geração real de PDF, um ambiente onde o Chromium gerenciado pelo Puppeteer possa iniciar.

### Instalação

Partindo da raiz do repositório:

~~~bash
cd back-end
npm install
~~~

O projeto possui o arquivo `.env.example`. Copie-o para `.env`:

**PowerShell:**

~~~powershell
Copy-Item .env.example .env
~~~

**Bash:**

~~~bash
cp .env.example .env
~~~

Preencha as variáveis:

~~~dotenv
SECRET_KEY=coloque-aqui-um-segredo-forte-e-aleatorio
PORT=3005
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_local
POSTGRES_DB_NAME=clients_pdf
POSTGRES_DB_PORT=5432
~~~

| Variável | Descrição |
| --- | --- |
| `SECRET_KEY` | Segredo utilizado para assinar/verificar o JWT |
| `PORT` | Porta HTTP da API |
| `POSTGRES_HOST` | Servidor do PostgreSQL |
| `POSTGRES_USER` | Usuário de acesso ao banco |
| `POSTGRES_PASSWORD` | Senha local do banco |
| `POSTGRES_DB_NAME` | Nome do banco já criado |
| `POSTGRES_DB_PORT` | Porta PostgreSQL, geralmente 5432 |

**Importante:** o servidor usa `PORT || 3000`. Como a URL do Axios do Front-end é atualmente `http://localhost:3005`, sugerimos `PORT=3005`. A porta 3000 é usada pelo Vite.

### Migrações

O ambiente PostgreSQL utiliza `synchronize: false`, portanto a estrutura precisa ser criada pelas migrações.

~~~bash
npm run typeorm -- migration:run -d src/data-source.ts
~~~

A configuração do TypeORM está em `src/data-source.ts`. Os arquivos de migração encontram-se em `src/migrations/`.

### Executar

~~~bash
npm run dev
~~~

O comando utiliza `ts-node-dev` e executa `src/server.ts`. O servidor só começa a escutar requisições depois que o `AppDataSource.initialize()` conecta ao banco.

O `package.json` também contém um script `start` que executa JavaScript compilado em `dist/src/server.js`. Ele não substitui a etapa de compilação; para desenvolvimento, prefira `npm run dev`.

### Compilação

~~~bash
npx tsc -p tsconfig.json
~~~

A saída é gerada em `dist/` conforme `tsconfig.json`. Confira o layout gerado antes de usar o script de produção, pois os caminhos de arquivos TypeORM referenciam `src/entities/*.ts` e `src/migrations/*.ts`, adequados ao fluxo TypeScript de desenvolvimento.

## Modelo de dados

### Entidade Client

Local: `src/entities/client.entity.ts`

| Campo | Tipo / regra |
| --- | --- |
| `id` | UUID, chave primária |
| `name` | Texto até 60 caracteres |
| `email` | Texto até 60 caracteres, único |
| `telephone` | Texto |
| `password` | Hash bcrypt armazenado em texto de até 150 caracteres |
| `createdAt` / `updatedAt` | Datas automáticas |
| `contact` | Relacionamento um-para-muitos |

O campo `password` utiliza `@Exclude()` para não aparecer nas respostas serializadas por `instanceToPlain`.

### Entidade Contact

Local: `src/entities/contact.entity.ts`

| Campo | Tipo / regra |
| --- | --- |
| `id` | UUID, chave primária |
| `name` | Até 60 caracteres |
| `email` | Até 60 caracteres, único |
| `telephone` | Até 14 caracteres no banco |
| `createdAt` / `updatedAt` | Datas automáticas |
| `client` | Relação muitos-para-um com Client |

O e-mail do contato é **único em toda a tabela**, mesmo entre clientes diferentes. Essa é a restrição do banco na versão atual.

O relacionamento usa `onDelete: "CASCADE"`: ao excluir um cliente, os contatos associados também são removidos.

~~~text
clients
  id (UUID, PK)
  name
  email (UNIQUE)
  telephone
  password (hash)
  createdAt
  updatedAt
      |
      | 1:N
      v
contacts
  id (UUID, PK)
  clientId (FK)
  name
  email (UNIQUE)
  telephone
  createdAt
  updatedAt
~~~

## Autenticação e autorização

### Cadastro

O endpoint `POST /clients` é público. A senha é processada por bcrypt com custo configurado em 10 antes de ser salva.

### Login

`POST /login` recebe e-mail e senha, verifica o hash existente e retorna:

~~~json
{
  "token": "<JWT>"
}
~~~

O token é assinado com `SECRET_KEY`, inclui o ID do cliente como `sub` e possui expiração configurada em **24h**.

### Rotas protegidas

As rotas privadas requerem:

~~~http
Authorization: Bearer SEU_TOKEN
~~~

O middleware `authClient` verifica o token e expõe os dados autenticados em `req.client`. O ID da conta autenticada deve ser a referência para consultas e operações.

A listagem de clientes retorna os registros da **própria conta**, e não todos os usuários cadastrados.

A listagem de contatos também é filtrada pelo cliente autenticado. Edição e exclusão verificam se o contato pertence a essa conta.

> Observação de revisão: no controller atual de exclusão de cliente, o ID utilizado é obtido do JWT; o parâmetro da URL é validado como UUID, mas não é confrontado com esse ID. A operação se comporta como exclusão da própria conta. Revisar explicitamente esse contrato antes de usar a API em produção.

## Referência dos endpoints

URL de exemplo: `http://localhost:3005`

| Método | Rota | JWT | Sucesso |
| --- | --- | --- | --- |
| POST | `/clients` | Não | 201 |
| POST | `/login` | Não | 200 |
| GET | `/clients` | Sim | 200 |
| PATCH | `/clients/:id` | Sim | 200 |
| DELETE | `/clients/:id` | Sim | 204 |
| GET | `/clients/relatory` | Sim | 200, PDF |
| POST | `/contacts` | Sim | 201 |
| GET | `/contacts` | Sim | 200 |
| PATCH | `/contacts/:id` | Sim | 200 |
| DELETE | `/contacts/:id` | Sim | 204 |

### 1. POST /clients — criar cliente

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

Resposta: status `201` com dados do cliente criado, sem a senha em texto plano. E-mail duplicado resulta em conflito (`409`).

### 2. POST /login — autenticar

~~~http
POST /login
Content-Type: application/json

{
  "email": "cliente@email.com",
  "password": "SenhaForte123"
}
~~~

Resposta: `200` com objeto contendo `token`. Utilize-o nas demais requisições protegidas.

### 3. GET /clients — consultar conta

~~~http
GET /clients
Authorization: Bearer SEU_TOKEN
~~~

Retorna um **array** com os registros encontrados para a conta autenticada. A entidade pode incluir seus contatos associados por meio da relação `contact`.

### 4. PATCH /clients/:id — atualização parcial

~~~http
PATCH /clients/UUID_DO_CLIENTE
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "name": "Cliente Atualizado",
  "telephone": "51988888888"
}
~~~

A API valida o UUID e impede atualização de outra conta. Os campos podem ser enviados isoladamente.

**Troca de senha pela API:**

~~~http
PATCH /clients/UUID_DO_CLIENTE
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "currentPassword": "SenhaAntiga123",
  "password": "SenhaNova456"
}
~~~

`password` e `currentPassword` devem ser informados **juntos**. O serviço verifica a senha atual e prepara o hash da nova senha. A interface web ainda não apresenta esse fluxo de troca de senha.

### 5. DELETE /clients/:id — excluir conta

~~~http
DELETE /clients/UUID_DO_CLIENTE
Authorization: Bearer SEU_TOKEN
~~~

Uma exclusão bem-sucedida retorna `204 No Content`. Como há cascata no relacionamento, os contatos associados também são eliminados. Na interface web essa operação pede confirmação e encerra a sessão após sucesso.

### 6. POST /contacts — criar contato

~~~http
POST /contacts
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "telephone": "51999999999"
}
~~~

A associação ao cliente é determinada pelo token. Resposta: `201` com o registro cadastrado. E-mail já utilizado na tabela de contatos pode resultar em `409`.

### 7. GET /contacts — listar contatos

~~~http
GET /contacts
Authorization: Bearer SEU_TOKEN
~~~

Resposta: array JSON com contatos pertencentes ao cliente autenticado.

### 8. PATCH /contacts/:id — editar contato

~~~http
PATCH /contacts/UUID_DO_CONTATO
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "email": "maria.nova@email.com"
}
~~~

Permite modificar `name`, `email` e/ou `telephone`. O serviço verifica se o contato pertence ao cliente autenticado.

### 9. DELETE /contacts/:id — excluir contato

~~~http
DELETE /contacts/UUID_DO_CONTATO
Authorization: Bearer SEU_TOKEN
~~~

Remove o contato próprio e retorna `204` em caso de sucesso. A UI possui modal de confirmação.

### 10. GET /clients/relatory — relatório PDF

~~~http
GET /clients/relatory
Authorization: Bearer SEU_TOKEN
~~~

Retorna arquivo PDF com o cliente autenticado e seus contatos. Detalhes abaixo.

## Relatório PDF

**A geração existe de verdade no Back-end**, mas não possui botão no Front-end.

O fluxo é:

1. `clients.routes.ts` registra `GET /clients/relatory` com `authClient`.
2. `listClientsRelatory.service.ts` consulta o cliente autenticado e a relação `contact`.
3. `generateHTML.ts` monta uma tabela HTML com o nome do cliente e nome, e-mail e telefone dos contatos.
4. `convertToPDF.ts` abre um navegador headless via Puppeteer, injeta o HTML e gera um PDF em formato **A4**.
5. O controller retorna o Buffer e define os headers:

~~~http
Content-Type: application/pdf
Content-Disposition: attachment; filename="relatorio-clientes.pdf"
~~~

### Exemplo de download

**PowerShell / Windows:**

~~~powershell
curl.exe -H "Authorization: Bearer SEU_TOKEN" "http://localhost:3005/clients/relatory" -o "relatorio-clientes.pdf"
~~~

**Bash:**

~~~bash
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:3005/clients/relatory -o relatorio-clientes.pdf
~~~

O token deve ser obtido em `POST /login`.

### Limitações e cuidados

- A geração requer Puppeteer/Chromium funcional no ambiente.
- Os testes de integração atuais **mockam o conversor**; não exercitam um navegador real.
- O HTML é construído por interpolação de campos. Antes de disponibilizar esse serviço publicamente, é recomendado escapar os valores exibidos no relatório para evitar interpretação indevida de conteúdo como HTML.

## Validações e tratamento de erros

Os schemas Yup ficam em `src/schemas/`. As validações usam modo estrito (`strict`) e checam campos inesperados.

| Campo | Regras relevantes |
| --- | --- |
| Nome | Obrigatório no cadastro, até 60 caracteres |
| E-mail | Formato de e-mail, até 60 caracteres |
| Telefone do cliente | 8 a 20 caracteres, formato permitido (dígitos, espaços, `+`, `(`, `)`, `-`) |
| Telefone do contato | 8 a 14 caracteres, mesmo formato |
| Senha | Mínimo 8 caracteres e limite de 72 bytes do bcrypt |
| ID de rota | Formato UUID nas rotas `:id` |
| PATCH | Exige pelo menos um campo; campos não previstos são rejeitados |

A resposta do middleware Yup é, em geral:

~~~json
{
  "message": ["Email is required", "Password is required"]
}
~~~

Os erros de negócio utilizam `AppError` e retornam status HTTP e mensagem. Exemplos: `400` para validação, `403` para operação sem permissão, `404` para entidade inexistente, `409` para e-mail duplicado e `500` para falhas não tratadas.

**Observação de contrato:** atualmente o middleware de autenticação pode devolver `404` quando o header de autorização está ausente e `401` quando o token é inválido. Esses resultados refletem o código existente; uma padronização futura para `401` pode ser considerada.

## Testes automatizados

Frameworks: **Jest + Supertest + ts-jest**.

~~~bash
npm test
~~~

O script de testes define `NODE_ENV=test` e `SECRET_KEY` de teste. Com `NODE_ENV=test`, `src/data-source.ts` seleciona **SQLite em memória** com `synchronize: true`, dispensando um PostgreSQL para as suítes de integração.

As suítes existentes estão em:

- `src/__tests__/integrations/clients/clients.routes.test.ts`
- `src/__tests__/integrations/contacts/contacts.routes.test.ts`

Incluem cenários de criação, duplicidade, listagem, autenticação, PATCH e DELETE.

Os testes do PDF fazem mock de `convertToPDF`; faça um teste HTTP com navegador disponível para comprovar a geração real no ambiente de destino.

Para focar em falhas de teste:

~~~bash
npm test -- --runInBand
~~~

A suíte deve ser executada novamente após qualquer alteração de validações, controllers, middlewares ou serviços.

## Organização do código

~~~text
src/
├── __tests__/          # Integrações HTTP e mocks
├── controllers/        # Recebem as requisições e retornam responses
├── entities/           # Client e Contact
├── errors/             # AppError
├── interfaces/         # Tipagens de entrada
├── middlewares/        # JWT, UUID, Yup, tratamento de erro
├── migrations/         # Estrutura SQL
├── routes/             # Registro dos endpoints
├── schemas/            # Campos e objetos Yup
├── services/
│   ├── clients/        # Cadastro, listagem, edição, remoção, relatório
│   ├── contacts/       # CRUD, ownership
│   └── session/        # Autenticação
├── utils/
│   ├── convertToPDF.ts
│   ├── generateHTML.ts
│   ├── handleUniqueViolation.ts
│   └── requireEntity.ts
├── app.ts
├── data-source.ts
└── server.ts
~~~

O arquivo `app.ts` monta a aplicação Express sem iniciar a escuta. Essa separação permite que o Supertest teste a API sem subir um servidor TCP. O `server.ts` conecta o banco e inicia o listener.

## Observações e melhorias futuras

Esta é uma aplicação de estudo e portfólio; antes de um deploy público, recomenda-se:

- Verificar explicitamente `req.params.id === req.client.id` no endpoint DELETE de cliente ou redefinir a rota para remoção da própria conta.
- Escapar valores inseridos no HTML do PDF.
- Restringir CORS e configurar cabeçalhos HTTP apropriados ao ambiente.
- Revisar o gerenciamento e a revogação de tokens.
- Validar empacotamento de migrations/entidades e Chromium em uma build de produção.
- Adicionar testes específicos para autorização cruzada, erros de PDF e condições de corrida.
- Adotar paginação para grande número de contatos, se necessário.
- Acrescentar CI para rodar TypeScript e Jest automaticamente.

---

**Desenvolvedor:** [Richard Zago](https://github.com/richzago) · [Voltar ao README principal](../README.md)
