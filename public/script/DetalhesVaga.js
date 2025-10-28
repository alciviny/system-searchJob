/**
 * Módulo para gerenciar a exibição dos detalhes da vaga.
 */

// Função para criar o HTML da seção "sobre" com os detalhes da vaga.
function criarCartaoSobre(vaga) {
    const dataFormatada = new Date(vaga.data).toLocaleDateString('pt-BR');
    return ` 
    <div class="sobre-vaga">
        <h1>${vaga.titulo}</h1>
        <h2>${vaga.empresa}</h2>
        <div class="sobre-informacoes">
            <h3>${vaga.contrato || ''}</h3>
            ${vaga.salario ? `<h3>Salário: ${vaga.salario}</h3>` : ''}
            <h3>${dataFormatada}</h3>
        </div>
        <div class="sobre-descricao">
            ${vaga.descricao}
        </div>
        <div class="sobre-actions">
            <a href="${vaga.url}" target="_blank" class="vaga-botao-inscricao">Ver Vaga Completa</a>
        </div>
    </div>`;
}

/**
 * Inicializa o listener para exibir os detalhes da vaga ao clicar em um card.
 * @param {HTMLElement} vagasUlElement - O elemento <ul> que contém os cards das vagas.
 * @param {HTMLElement} vagasSobreElement - O elemento <div> onde os detalhes serão exibidos.
 * @param {function(): Array} getVagasCarregadas - Uma função que retorna o array com todas as vagas carregadas.
 */
function inicializarDetalhesVaga(vagasUlElement, vagasSobreElement, getVagasCarregadas) {

    // Função debounce para atrasar a execução do manipulador de eventos
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Manipulador de evento que será "debounced"
    const handleMouseOver = (e) => {
        const vagaLi = e.target.closest('.vagaLI'); // Encontra o card (li) sob o mouse
        if (!vagaLi) {
            // Se o mouse saiu de um card e está sobre a ul ou outro elemento não-card,
            // podemos limpar a seção de detalhes ou deixar a última vaga.
            // Por enquanto, vamos apenas não fazer nada.
            return;
        }

        const vagaId = vagaLi.dataset.id;
        const todasVagas = getVagasCarregadas();
        const vagaSelecionada = todasVagas.find(v => v.id === vagaId);

        if (vagaSelecionada) {
            const cartaoSobreHtml = criarCartaoSobre(vagaSelecionada);
            vagasSobreElement.innerHTML = cartaoSobreHtml;
        }
    };

    // Adiciona o event listener com a função debounced
    vagasUlElement.addEventListener('mouseover', debounce(handleMouseOver, 150)); // Atraso de 150ms
}