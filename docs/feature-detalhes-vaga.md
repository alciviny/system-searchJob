# Plano de Ação: Exibir Detalhes da Vaga ao Clicar

Este documento descreve os passos necessários para implementar a funcionalidade onde o clique em um card de vaga exibe seus detalhes completos na seção ao lado.

**Arquivo a ser modificado:** `public/script/VagasFrontEnd.js`

---

## Passo 1: Criar a "Memória" para os Dados das Vagas

**Objetivo:** Manter uma lista com os dados completos de todas as vagas carregadas, incluindo a descrição, para que possamos acessá-los a qualquer momento.

#### Ação 1.1: Declarar a variável de "memória"

Na seção `VARIÁVEIS DE ESTADO`, adicione um novo array para guardar as vagas.

```javascript
let paginaAtual = 1;
let buscaAtual = { cargo: '', localizacao: '', data: '0' };
let todasVagasCarregadas = []; // <-- ADICIONAR ESTA LINHA
```

#### Ação 1.2: Alimentar a "memória" e gerar IDs

Dentro da função `realizarBusca`, logo após receber os dados da API (`const vagasEncontradas = ...`), você precisa:
1.  Criar um ID único para cada vaga.
2.  Adicionar essas vagas com ID à sua "memória" (`todasVagasCarregadas`).
3.  Usar essa nova lista com IDs para criar os cards.

```javascript
// Dentro de realizarBusca(), substitua a linha `const cardsHtml = ...` por este bloco:

// 1. Adiciona um ID único a cada vaga e as armazena
const vagasComId = vagasEncontradas.map(vaga => {
    vaga.id = vaga.id || `${vaga.titulo}-${vaga.empresa}-${vaga.localizacao}-${vaga.data}`;
    return vaga;
});
todasVagasCarregadas = todasVagasCarregadas.concat(vagasComId);

// 2. Usa a lista com IDs para criar os cards
const cardsHtml = vagasComId.map(criarCartaoVaga).join('');
```

---

## Passo 2: Adicionar a "Etiqueta de Identificação" nos Cards

**Objetivo:** Marcar cada card (`<li>`) com o ID único da vaga que ele representa, para que possamos identificá-lo quando for clicado.

#### Ação 2.1: Modificar a função `criarCartaoVaga`

Adicione o atributo `data-id="${vaga.id}"` à tag `<li>`.

```javascript
// Na função criarCartaoVaga, modifique a primeira linha do template string:
const card = `
 <li class="vagaLI" data-id="${vaga.id}">
    // ... resto do card
</li>
`;
```

---

## Passo 3: Implementar o "Ouvinte" de Cliques

**Objetivo:** Detectar quando um usuário clica em um card, identificar qual vaga foi selecionada e usar a função `CriarCartaoSobre` para exibir os detalhes.

#### Ação 3.1: Adicionar o `addEventListener`

Na seção `LISTENERS DE EVENTOS`, adicione o seguinte bloco de código. Ele vai "ouvir" os cliques na lista de vagas.

```javascript
// Listener para cliques nos cards de vaga (Delegação de Eventos)
vagasUl.addEventListener('click', (e) => {
    const vagaLi = e.target.closest('.vagaLI'); // Encontra o card (li) clicado
    if (!vagaLi) return; // Se não clicou num card, para aqui

    const vagaId = vagaLi.dataset.id; // Pega a "etiqueta" (ID) do card
    const vagaSelecionada = todasVagasCarregadas.find(v => v.id === vagaId); // Procura a vaga na "memória"

    if (vagaSelecionada) {
        const cartaoSobreHtml = CriarCartaoSobre(vagaSelecionada); // Cria o HTML dos detalhes
        VagasSobre.innerHTML = cartaoSobreHtml; // Atualiza a seção "sobre"
    }
});
```

---

Com estes três passos, a funcionalidade estará completa.