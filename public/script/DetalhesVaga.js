// =================================================================
// MÓDULO DE DETALHES DA VAGA
// =================================================================

// --- Funções Auxiliares / UI ---
function traduzirContrato(tipoContrato) {
    if (!tipoContrato) return "";
    const contratoLower = tipoContrato.toLowerCase();

    switch (contratoLower) {
        case 'full_time':
        case 'full time':
        case 'full-time':
            return 'Tempo Integral';
        case 'part_time':
        case 'part time':
        case 'part-time':
            return 'Meio Período';
        case 'internship':
            return 'Estágio';
        default:
            return tipoContrato;
    }
}

function criarCartaoSobre(vaga) {
    const dataFormatada = new Date(vaga.data).toLocaleDateString('pt-BR');
    const contratoTraduzido = traduzirContrato(vaga.contrato);
    const descricaoFormatada = vaga.descricao.replace(/\n/g, '<br>');

    return ` 
    <div class="sobre-vaga">
        <h1>${vaga.titulo}</h1>
        <h2>${vaga.empresa}</h2>
        <div class="sobre-informacoes">
            ${contratoTraduzido ? `<h3>${contratoTraduzido}</h3>` : ''}
            ${vaga.salario ? `<h3>Salário: ${vaga.salario}</h3>` : ''}
            <h3>${dataFormatada}</h3>
        </div>
        <div class="sobre-descricao">
            ${descricaoFormatada}
        </div>
        <div class="sobre-actions">
            <a href="${vaga.url}" target="_blank" class="vaga-botao-inscricao">Ver Vaga Completa</a>
        </div>
    </div>`;
}

// --- Função Principal de Inicialização ---
function inicializarDetalhesVaga(vagasUlElement, vagasSobreElement, getVagasCarregadas) {

    // --- Função Interna (Debounce) ---
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // --- Manipulador de Evento (Handler) ---
    const handleMouseOver = (e) => {
        const vagaLi = e.target.closest('.vagaLI');
        if (!vagaLi) {
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

    // --- Listener de Evento ---
    vagasUlElement.addEventListener('mouseover', debounce(handleMouseOver, 150));
}