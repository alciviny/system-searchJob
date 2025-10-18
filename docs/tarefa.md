

## 📖 Documentação da API

A seguir estão os endpoints disponíveis na API.

### 🔑 Autenticação

#### 1. Cadastro de Novo Usuário

* **Endpoint:** `POST /api/usuarios/cadastro`
* **Descrição:** Registra um novo usuário no sistema.
* **Corpo da Requisição (`body`):**
    ```json
    {
      "nome": "Seu Nome Completo",
      "email": "email@exemplo.com",
      "senha": "senhaComPeloMenos8Caracteres"
    }
    ```
* **Resposta de Sucesso (`201 Created`):**
    ```json
    {
      "sucesso": true,
      "mensagem": "Usuário cadastrado com sucesso!",
      "usuarioId": 1
    }
    ```
* **Resposta de Erro (`409 Conflict` - E-mail já existe):**
    ```json
    {
      "sucesso": false,
      "mensagem": "Este e-mail já está em uso."
    }
    ```

#### 2. Login de Usuário

* **Endpoint:** `POST /api/usuarios/login`
* **Descrição:** Autentica um usuário e retorna um token de acesso.
* **Corpo da Requisição (`body`):**
    ```json
    {
      "email": "email@exemplo.com",
      "senha": "suaSenha"
    }
    ```
* **Resposta de Sucesso (`200 OK`):**
    ```json
    {
      "sucesso": true,
      "mensagem": "Login bem-sucedido!",
      "token": "seu.token.jwt.aqui"
    }
    ```
* **Resposta de Erro (`401 Unauthorized`):**
    ```json
    {
      "sucesso": false,
      "mensagem": "E-mail ou senha incorretos."
    }
    ```

### 📄 Currículo (Rotas Protegidas)

**Importante:** Todas as rotas de currículo exigem que o token JWT seja enviado no cabeçalho da requisição.
`Authorization: Bearer seu.token.jwt.aqui`

#### 1. Salvar ou Atualizar Currículo

* **Endpoint:** `PUT /api/curriculo`
* **Descrição:** Cria ou atualiza as informações do currículo do usuário autenticado.
* **Corpo da Requisição (`body`):**
    ```json
    {
      "nomeCompleto": "João da Silva Santos",
      "telefone": "(98) 98888-7777",
      "cidade": "São Paulo",
      "resumoProfissional": "Desenvolvedor júnior...",
      "experiencias": [
        { "empresa": "Empresa X", "cargo": "Estagiário", "periodo": "2024 - Presente" }
      ],
      "formacao": [
        { "instituicao": "Universidade Y", "curso": "Sistemas de Informação", "periodo": "2022 - 2026" }
      ]
    }
    ```
* **Resposta de Sucesso (`200 OK`):**
    ```json
    {
      "sucesso": true,
      "mensagem": "Currículo salvo com sucesso!"
    }
    ```

#### 2. Buscar Currículo

* **Endpoint:** `GET /api/curriculo`
* **Descrição:** Retorna as informações do currículo do usuário autenticado.
* **Resposta de Sucesso (`200 OK`):**
    * Retorna o mesmo objeto JSON enviado na rota `PUT`.
* **Resposta de Erro (`404 Not Found`):**
    ```json
    {
      "sucesso": false,
      "mensagem": "Nenhum currículo encontrado para este usuário."
    }
    ```

