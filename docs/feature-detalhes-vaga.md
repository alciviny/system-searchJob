# Feature: Detalhes da Vaga

Este documento registra o plano de ação para implementar a funcionalidade de exibição de detalhes da vaga ao passar o mouse sobre um card.

**Arquivo principal:** `public/script/VagasFrontEnd.js`

---

## 1. Armazenamento de Dados em Memória

**Objetivo:** Manter uma lista com os dados completos de todas as vagas carregadas para acesso rápido, sem a necessidade de novas requisições à API.

#### 1.1. Declarar a variável de estado

Na seção de variáveis de estado, foi adicionado um array para armazenar as vagas.
```javascript
let todasVagasCarregadas = [];
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