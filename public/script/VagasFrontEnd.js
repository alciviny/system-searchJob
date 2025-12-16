import { traduzirContrato } from './utils.js';
import { inicializarDetalhesVaga } from './DetalhesVaga.js';
import { inicializarAutenticacao } from './auth.js';
import { inicializarFavoritos, atualizarEstadoFavoritos, listarFavoritos } from './favoritos.js';
const API_URL = '/vagas/filtrar';
const formulario = document.querySelector('.search-container');
const vagasUl = document.querySelector('.vagasUl');
const btnCarregarMais = document.getElementById('btn-carregar-mais');
const hamburger = document.querySelector('.hamburger-menu');
const headerContent = document.querySelector('.header-content');
const VagasSobre = document.querySelector('.sobre');
let paginaAtual = 1;
let buscaAtual = { cargo: '', localizacao: '', data: '0' };
let todasVagasCarregadas = [];
function criarCartaoVaga(vaga) {
    const dataFormatada = new Date(vaga.data).toLocaleDateString('pt-BR');
    const contratoTraduzido = traduzirContrato(vaga.contrato);
    return `
    <li class="vagaLI" data-id="${vaga.id}">
      <button class="btn-favoritar" title="Adicionar aos favoritos" aria-label="Favoritar vaga">
        <i class="fa-solid fa-heart"></i>
      </button>
      <h3 class="vaga-titulo">${vaga.titulo}</h3>
      ${contratoTraduzido ? `<p class="vaga-contrato">${contratoTraduzido}</p>` : ''}
      <h4 class="vaga-empresa">${vaga.empresa}</h4>
      <p class="vaga-localizacao">${vaga.localizacao}</p>
      <p class="vaga-fonte">Fonte: ${vaga.fonte || 'Desconhecida'}</p>
      <p class="vaga-data">Publicado em: ${dataFormatada}</p>
      <p class="vaga-sobre"><a href="${vaga.url}" target="_blank" class="vaga-botao-inscricao">Ver Vaga</a></p>
    </li>
  `;
}
async function realizarBusca(novaBusca = false) {
    btnCarregarMais.disabled = true;
    btnCarregarMais.textContent = 'Carregando...';
    if (novaBusca) {
        paginaAtual = 1;
        vagasUl.innerHTML = '';
        VagasSobre.innerHTML = `
      <div class="sobre-placeholder">
        <i class="fa-solid fa-hand-pointer"></i>
        <h3>Passe o mouse sobre uma vaga</h3>
        <p>Veja os detalhes aqui</p>
      </div>
    `;
    }
    const params = new URLSearchParams({
        ...buscaAtual,
        page: paginaAtual.toString()
    });
    const queryString = params.toString();
    try {
        const response = await fetch(`${API_URL}?${queryString}`);
        if (!response.ok) {
            throw new Error(`A resposta da rede não foi OK. Status: ${response.status}`);
        }
        const vagasEncontradas = await response.json();
        const vagasComId = vagasEncontradas.map((vaga) => ({
            ...vaga,
            id: vaga.id || `${vaga.titulo}-${vaga.empresa}-${vaga.localizacao}-${vaga.data}`
        }));
        todasVagasCarregadas = todasVagasCarregadas.concat(vagasComId);
        if (vagasEncontradas.length === 0) {
            if (novaBusca) {
                vagasUl.innerHTML = `<li class="vaga-aviso">Nenhuma vaga encontrada para esta busca.</li>`;
            }
            btnCarregarMais.style.display = 'none';
        }
        else {
            const cardsHtml = vagasComId.map(criarCartaoVaga).join('');
            vagasUl.insertAdjacentHTML('beforeend', cardsHtml);
            btnCarregarMais.style.display = 'inline-block';
        }
    }
    catch (error) {
        console.error('Erro ao buscar vagas:', error);
        if (novaBusca) {
            vagasUl.innerHTML = `<li class="vaga-aviso error">Ocorreu um erro ao buscar as vagas. Tente novamente.</li>`;
        }
        btnCarregarMais.textContent = 'Erro ao carregar';
        btnCarregarMais.style.display = 'none';
    }
    finally {
        btnCarregarMais.disabled = false;
        btnCarregarMais.textContent = 'Carregar Mais Vagas';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    inicializarAutenticacao();
    await realizarBusca(true);
    await inicializarFavoritos(vagasUl);
});
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formValues = {};
    const entries = formData.entries ? formData.entries() : [];
    for (const [key, value] of entries) {
        formValues[key] = value;
    }
    buscaAtual = Object.assign({}, buscaAtual, formValues);
    await realizarBusca(true);
    const favoritosCarregados = await listarFavoritos();
    await atualizarEstadoFavoritos(vagasUl, favoritosCarregados);
});
btnCarregarMais.addEventListener('click', async () => {
    paginaAtual++;
    await realizarBusca(false);
    const favoritosCarregados = await listarFavoritos();
    await atualizarEstadoFavoritos(vagasUl, favoritosCarregados);
});
inicializarDetalhesVaga(vagasUl, VagasSobre, () => todasVagasCarregadas);
hamburger.addEventListener('click', () => {
    headerContent.classList.toggle('active');
});
//# sourceMappingURL=VagasFrontEnd.js.map