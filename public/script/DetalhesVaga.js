import { traduzirContrato } from './utils.js';
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
    </div>
  `;
}
export function inicializarDetalhesVaga(vagasUlElement, vagasSobreElement, getVagasCarregadas) {
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };
    const handleMouseOver = (e) => {
        const target = e.target;
        const vagaLi = target.closest('.vagaLI');
        if (!vagaLi) {
            return;
        }
        const vagaId = vagaLi.dataset.id;
        const todasVagas = getVagasCarregadas();
        const vagaSelecionada = todasVagas.find((v) => v.id === vagaId);
        if (vagaSelecionada) {
            const cartaoSobreHtml = criarCartaoSobre(vagaSelecionada);
            vagasSobreElement.innerHTML = cartaoSobreHtml;
        }
    };
    vagasUlElement.addEventListener('mouseover', debounce(handleMouseOver, 150));
}
//# sourceMappingURL=DetalhesVaga.js.map