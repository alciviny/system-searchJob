# Feature: Busca Avançada de Vagas

Este documento detalha o plano para implementar melhorias na funcionalidade de busca de vagas, tornando-a mais poderosa e fácil de usar.

## 1. Filtros de Busca por Cargo e Localização

**Objetivo:** Permitir que o usuário refine a busca de vagas especificando um cargo (palavra-chave) e uma localização.

### Plano de Ação:

#### Frontend (`public/`)

1.  **`index.html`**:
    *   Adicionar dois campos de texto (`<input type="text">`) antes da lista de vagas:
        *   Um para o "Cargo ou Palavra-chave" (ID: `filtro-cargo`).
        *   Um para a "Localização" (ID: `filtro-localizacao`).
    *   Adicionar um botão (`<button>`) "Buscar" (ID: `btn-buscar`).

2.  **`script/VagasFrontEnd.js`**:
    *   Modificar a função `CarregarVagas` para que ela possa receber os filtros como parâmetros.
    *   Adicionar um "event listener" ao clique do botão "Buscar".
    *   Quando o botão for clicado, a função deve:
        *   Ler os valores dos inputs `filtro-cargo` e `filtro-localizacao`.
        *   Construir a URL da API com *query parameters* (ex: `/vagas?cargo=Desenvolvedor&localizacao=São%20Paulo`).
        *   Chamar a função `fetch` com a nova URL.
        *   Limpar a lista de vagas atual antes de exibir os novos resultados.

#### Backend (`src/`)

1.  **`controllers/vagasController.js`**:
    *   Na função `obterVagas`, extrair os parâmetros de filtro do objeto `req.query`.
        ```javascript
        const { cargo, localizacao } = req.query;
        ```
    *   Passar esses valores como argumentos para a função do serviço.
        ```javascript
        const vagas = await vagasService.todasVagas(cargo, localizacao);
        ```

2.  **`services/vagasService.js`**:
    *   Atualizar a assinatura da função `todasVagas` e `vagaAdzuna` para aceitar `cargo` and `localizacao`.
    *   Na função `vagaAdzuna`, verificar se os filtros foram fornecidos.
    *   Se existirem, adicioná-los aos parâmetros da URL da API Adzuna. A API Adzuna usa `what` para palavra-chave e `where` para localização.
        ```javascript
        // Exemplo de como adicionar os parâmetros
        if (cargo) params.set('what', cargo);
        if (localizacao) params.set('where', localizacao);
        ```

## 2. Paginação

**Objetivo:** Carregar mais resultados de vagas sem precisar recarregar a página inteira.

### Plano de Ação:

#### Frontend (`public/`)

1.  **`index.html`**:
    *   Adicionar um botão "Carregar Mais Vagas" (ID: `btn-carregar-mais`) ao final da seção de vagas.

2.  **`script/VagasFrontEnd.js`**:
    *   Manter uma variável global para controlar o número da página atual (ex: `let paginaAtual = 1;`).
    *   Ao clicar no botão "Buscar" (do filtro), a `paginaAtual` deve ser resetada para `1`.
    *   Adicionar um "event listener" ao clique do botão `btn-carregar-mais`.
    *   Quando o botão for clicado, a função deve:
        *   Incrementar a `paginaAtual`.
        *   Chamar a API novamente, passando a nova página como *query parameter* (ex: `/vagas?page=2`).
        *   **Anexar** os novos resultados à lista de vagas existente, em vez de limpá-la.

#### Backend (`src/`)

1.  **`controllers/vagasController.js`**:
    *   Extrair o parâmetro `page` de `req.query`.
    *   Passar a página para a função do serviço.

2.  **`services/vagasService.js`**:
    *   Atualizar as funções para receber o parâmetro `page`.
    *   Na `vagaAdzuna`, usar o número da página na construção da URL. A API da Adzuna usa o formato `/api/jobs/br/search/{page}`.
        ```javascript
        // Exemplo de URL
        const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;
        ```

## 3. Detalhes da Vaga (Modal)

**Objetivo:** Exibir mais informações sobre uma vaga em uma janela modal antes de o usuário sair do site.

### Plano de Ação:

#### Frontend (`public/`)

1.  **`index.html`**:
    *   Remover o `<a>` (link) de dentro do card da vaga.
    *   Adicionar uma estrutura básica para um modal (inicialmente escondido com CSS). O modal deve conter um título, um corpo para a descrição e um botão "Candidatar-se".

2.  **`script/VagasFrontEnd.js`**:
    *   Na função `CartaoVaga`, adicionar um atributo de dados a cada `<li>` com a URL da vaga (ex: `data-url="${vaga.url}"`).
    *   Adicionar um "event listener" de clique na `<ul>` (a lista de vagas) para usar a delegação de eventos.
    *   Quando um `<li>` (card de vaga) for clicado:
        *   Obter os dados da vaga que já foram carregados (título, empresa, descrição, etc.).
        *   Preencher o conteúdo do modal com essas informações.
        *   Atualizar o link do botão "Candidatar-se" do modal com a URL da vaga.
        *   Exibir o modal.
