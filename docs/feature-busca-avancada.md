# Feature: Busca Avançada de Vagas

Este documento registra o plano de ação para implementar a funcionalidade de busca avançada de vagas.

---

## 1. Filtros de Busca por Cargo e Localização

**Objetivo:** Permitir que o usuário refine a busca de vagas especificando um cargo (palavra-chave) e uma localização.

#### Frontend (`public/`)

1.  **HTML:** Adicionar campos de texto para "Cargo" e "Localização" e um botão "Buscar".
2.  **JavaScript:** Adicionar um `event listener` ao botão "Buscar" para ler os valores dos inputs, construir a URL da API com os filtros como *query parameters*, e chamar a função de busca.

#### Backend (`src/`)

1.  **Controller:** Extrair os parâmetros `cargo` e `localizacao` de `req.query` e passá-los para o serviço.
2.  **Service:** Modificar as funções de busca para aceitar os filtros e adicioná-los aos parâmetros da requisição para a API externa (ex: `what` e `where` para a Adzuna).

---

## 2. Paginação

**Objetivo:** Carregar mais resultados de vagas sem precisar recarregar a página inteira.

#### Frontend (`public/`)

1.  **HTML:** Adicionar um botão "Carregar Mais Vagas".
2.  **JavaScript:** Manter uma variável de estado para a `paginaAtual`. Ao clicar no botão, incrementar a página, chamar a API com o novo número da página e anexar os resultados à lista existente.

#### Backend (`src/`)

1.  **Controller:** Extrair o parâmetro `page` de `req.query` e passá-lo para o serviço.
2.  **Service:** Usar o número da página na construção da URL da API externa.

---

## 3. Detalhes da Vaga (Modal)

**Objetivo:** Exibir mais informações sobre uma vaga em uma janela modal antes de o usuário sair do site.

#### Frontend (`public/`)

1.  **HTML:** Adicionar a estrutura de um modal (inicialmente oculto).
2.  **JavaScript:** Adicionar um `event listener` na lista de vagas. Ao clicar em um card, obter os dados da vaga (já carregados em memória), preencher o modal com essas informações e exibi-lo.
