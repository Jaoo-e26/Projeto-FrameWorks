# 🎓 API de Alunos — Node.js, Express & Prisma

Projeto de gestão de alunos desenvolvido na disciplina de **Node.js, Express e Prisma**. A aplicação é uma API RESTful estruturada na arquitetura em camadas (**Model-Service-Controller-Routes**), contendo validações de negócio e tratamento de exceções personalizadas.

---

## 📐 Arquitetura do Projeto

A aplicação segue a separação clara de responsabilidades:

* **Routes (`src/routes/`)**: Mapeia as rotas e verbos HTTP, repassando as requisições para os controllers correspondentes.
* **Controllers (`src/controllers/`)**: Recebe a requisição HTTP (`req`), gerencia os parâmetros/corpo, aciona os serviços e devolve a resposta (`res`) adequada dentro de blocos `try...catch`.
* **Services (`src/services/`)**: Centraliza as regras de negócio, validações de dados e chamadas ao banco de dados via Prisma Client.
* **Errors (`src/errors/`)**: Exceções personalizadas que herdam da classe base `ApiError`, retornando mensagens legíveis e status HTTP padronizados.
* **Prisma Schema (`prisma/schema.prisma`)**: Define o modelo de dados e a conexão com a base de dados.

---

## 📁 Estrutura de Ficheiros

```text
projeto-alunos/
├── prisma/
│   └── schema.prisma           # Schema da base de dados (Model Aluno)
├── src/
│   ├── controllers/
│   │   └── AlunoController.js  # Métodos do controller com try/catch
│   ├── errors/
│   │   ├── ApiError.js         # Classe base para erros da API (statusCode + message)
│   │   ├── AlunoInvalidoError.js     # Exceção personalizada (400 Bad Request)
│   │   ├── AlunoNaoEncontradoError.js# Exceção personalizada (404 Not Found)
│   │   └── EmailJaCadastradoError.js # Exceção personalizada (409 Conflict)
│   ├── routes/
│   │   └── alunoRouter.js      # Definição das rotas HTTP
│   ├── services/
│   │   └── AlunoService.js     # Lógica de negócio e métodos do Prisma Client
│   └── server.js               # Ponto de entrada do servidor Express
├── package.json
└── README.md
```

---

## 🚀 Funcionalidades da Aplicação

### 🟢 Parte 1 — Estrutura Inicial (Desenvolvida em Sala)

1. **`GET /alunos` (Paginação Básica)**: Listagem de alunos aceitando os parâmetros `page` e `pageSize` via query string.
2. **`POST /alunos` (Cadastro de Aluno)**: Criação de aluno validando o preenchimento obrigatório de `nome` e `email`. Dispara `AlunoInvalidoError` (status 400) caso faltem campos.
3. **Tratamento de Erros Base**: Classe base `ApiError` estendendo a classe nativa `Error` do JavaScript para padronizar `statusCode` e `message`.

---

### 🔵 Parte 2 — Requisitos da Primeira Avaliação

4. **Requisito 1 — Ordenação & Contagem Total (`GET /alunos`)**:
   * Suporte aos parâmetros de ordenação `orderBy` (`id`, `nome`, `email`, `createdAt`) e `order` / `tipoordenacao` (`asc` ou `desc`).
   * Retorno do atributo `total` no corpo da resposta contendo o número total de alunos cadastrados (`prisma.aluno.count()`).

5. **Requisito 2 — Busca por ID (`GET /alunos/:id`)**:
   * Consulta de um único aluno pelo ID.
   * Lança a exceção personalizada `AlunoNaoEncontradoError` (status 404) quando o ID não existe na base de dados.

6. **Requisito 3 — Atualização de Aluno (`PUT /alunos/:id` ou `PATCH /alunos/:id`)**:
   * Atualização parcial ou total do `nome` e/ou `email`.
   * Trata ID inexistente (404), ausência de dados no corpo (400) e tentativa de registar um e-mail já existente com a exceção `EmailJaCadastradoError` (409).

7. **Requisito 4 — Remoção de Aluno (`DELETE /alunos/:id`)**:
   * Remoção física do registo de um aluno por ID.
   * Valida se o aluno existe antes de eliminar (404) e responde com o status `204 No Content` em caso de sucesso.

---

## 📚 Documentação das Rotas

### 1. Listar Alunos (Paginado + Ordenado + Total)
* **Método:** `GET`
* **Rota:** `/alunos`
* **Query Parameters (Opcionais):**
  * `page` (padrão: `1`)
  * `pageSize` (padrão: `10`)
  * `orderBy` (padrão: `id`)
  * `order` ou `tipoordenacao` (`asc` ou `desc`, padrão: `asc`)
* **Exemplo de Exemplo:** `/alunos?page=1&pageSize=5&orderBy=nome&order=asc`
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "alunos": [
      {
        "id": 1,
        "nome": "Ana Clara",
        "email": "ana.clara@email.com",
        "createdAt": "2026-03-20T10:00:00.000Z"
      },
      {
        "id": 2,
        "nome": "Bruno Silva",
        "email": "bruno.silva@email.com",
        "createdAt": "2026-03-21T14:20:00.000Z"
      }
    ],
    "total": 42
  }
  ```

---

### 2. Cadastrar Aluno
* **Método:** `POST`
* **Rota:** `/alunos`
* **Corpo (JSON):**
  ```json
  {
    "nome": "Carlos Eduardo",
    "email": "carlos.eduardo@email.com"
  }
  ```
* **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "id": 3,
    "nome": "Carlos Eduardo",
    "email": "carlos.eduardo@email.com",
    "createdAt": "2026-03-21T20:00:00.000Z"
  }
  ```

---

### 3. Buscar Aluno por ID
* **Método:** `GET`
* **Rota:** `/alunos/:id`
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 1,
    "nome": "Ana Clara",
    "email": "ana.clara@email.com",
    "createdAt": "2026-03-20T10:00:00.000Z"
  }
  ```
* **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "message": "Aluno não encontrado"
  }
  ```

---

### 4. Atualizar Aluno
* **Método:** `PUT` ou `PATCH`
* **Rota:** `/alunos/:id`
* **Corpo (JSON):**
  ```json
  {
    "nome": "Ana Clara Santos"
  }
  ```
* **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 1,
    "nome": "Ana Clara Santos",
    "email": "ana.clara@email.com",
    "createdAt": "2026-03-20T10:00:00.000Z"
  }
  ```

---

### 5. Remover Aluno
* **Método:** `DELETE`
* **Rota:** `/alunos/:id`
* **Resposta de Sucesso (`204 No Content`):** *(Sem corpo na resposta)*
* **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "message": "Aluno não encontrado"
  }
  ```

---

## 🛠️ Como Executar o Projeto

1. **Clonar o Repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd projeto-alunos
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar a Base de Dados e o Prisma:**
   ```bash
   npx prisma db push
   ```

4. **Iniciar o Servidor:**
   ```bash
   # Modo de desenvolvimento
   npm run dev

   # Modo de produção
   npm start
   ```

---

## 📌 Histórico de Commits (Exigência da Avaliação)

O histórico de commits no GitHub foi estruturado de forma isolada e incremental para atender aos critérios da avaliação:

1. `feat: adiciona ordenacao e contagem total no findMany de alunos`
2. `feat: adiciona busca de aluno por id (findUnique)`
3. `feat: adiciona atualizacao de aluno (update)`
4. `feat: adiciona remocao de aluno (delete)`
