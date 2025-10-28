// =================================================================
// CONFIGURAÇÕES E CONSTANTES
// =================================================================
const API_URL = 'http://localhost:3000/vagas/filtrar';

// =================================================================
// SELETORES DE ELEMENTOS DO DOM
// =================================================================
const formulario = document.querySelector('.search-container');
const vagasUl = document.querySelector('.vagasUl');
const btnCarregarMais = document.getElementById('btn-carregar-mais');
const hamburger = document.querySelector('.hamburger-menu');
const headerContent = document.querySelector('.header-content');
const VagasSobre = document.querySelector('.sobre')

// =================================================================
// VARIÁVEIS DE ESTADO
// =================================================================
let paginaAtual = 1;
let buscaAtual = { cargo: '', localizacao: '', data: '0' };
let todasVagasCarregadas = []; // <-- PASSO 1.1: A "Memória"

// =================================================================
// FUNÇÕES PRINCIPAIS
// =================================================================
/**
 * Realiza a busca de vagas na API com base nos filtros e na página atual.
 * @param {boolean} novaBusca - Se true, limpa os resultados atuais e reseta a página para 1.
 */
async function realizarBusca(novaBusca = false) {
    // Atualiza a UI para indicar que o carregamento está em andamento
    btnCarregarMais.disabled = true;
    btnCarregarMais.textContent = 'Carregando...';

    if (novaBusca) {
        paginaAtual = 1;
        vagasUl.innerHTML = '';
        // Limpa a seção de detalhes e restaura o placeholder
        VagasSobre.innerHTML = `
           <div class="sobre-placeholder">
                <i class="fa-solid fa-hand-pointer"></i>
                <h3>Passe o mouse sobre uma vaga</h3>
                <p>Veja os detalhes aqui</p>
           </div>`;
    }

    // Constrói os parâmetros da URL, incluindo a página e os filtros de busca
    const params = new URLSearchParams({
        ...buscaAtual,
        page: paginaAtual
    });
    const queryString = params.toString();

    try {
        const response = await fetch(`${API_URL}?${queryString}`);
        if (!response.ok) {
            throw new Error('A resposta da rede não foi OK. Status: ' + response.status);
        }
        const vagasEncontradas = await response.json();

        // PASSO 1.2: Alimentar a "memória" e gerar IDs
        const vagasComId = vagasEncontradas.map(vaga => {
            vaga.id = vaga.id || `${vaga.titulo}-${vaga.empresa}-${vaga.localizacao}-${vaga.data}`;
            return vaga;
        });
        todasVagasCarregadas = todasVagasCarregadas.concat(vagasComId);

        // Verifica se foram encontradas vagas
        if (vagasEncontradas.length === 0) {
            if (novaBusca) {
                vagasUl.innerHTML = `<li class="vaga-aviso">Nenhuma vaga encontrada para esta busca.</li>`;
            }
            btnCarregarMais.style.display = 'none'; // Esconde o botão se não houver mais resultados
        } else {
            // Otimização: cria todos os cards e insere no DOM de uma só vez
            // Otimização: cria todos os cards (usando a lista com IDs) e insere no DOM
            const cardsHtml = vagasComId.map(criarCartaoVaga).join('');
            vagasUl.insertAdjacentHTML('beforeend', cardsHtml);

            // Mostra o botão "Carregar Mais" se a API retornou resultados
            btnCarregarMais.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        if (novaBusca) {
            vagasUl.innerHTML = `<li class="vaga-aviso error">Ocorreu um erro ao buscar as vagas. Tente novamente.</li>`;
        }
        btnCarregarMais.textContent = 'Erro ao carregar';
        btnCarregarMais.style.display = 'none';
    } finally {
        // Reabilita o botão e restaura o texto, independentemente do resultado
        btnCarregarMais.disabled = false;
        btnCarregarMais.textContent = 'Carregar Mais Vagas';
    }
}

/**
 * Cria o HTML para um card de vaga.
 * @param {object} vaga - O objeto da vaga contendo título, empresa, etc.
 * @returns {string} O HTML do card da vaga.
 */
function criarCartaoVaga(vaga) {
    const dataFormatada = new Date(vaga.data).toLocaleDateString('pt-BR');
    return `
     <li class="vagaLI" data-id="${vaga.id}">
        <h3 class="vaga-titulo">${vaga.titulo}</h3>
        <h4 class="vaga-empresa">${vaga.empresa}</h4>
        <p class="vaga-localizacao">${vaga.localizacao}</p>
        <p class="vaga-data">Publicado em: ${dataFormatada}</p>
        <p class="vaga-sobre"><a href="${vaga.url}" target="_blank" class="vaga-botao-inscricao">Ver Vaga</a></p>
     </li>
    `;
}
// =================================================================
// LISTENERS DE EVENTOS
// =================================================================
// Inicia a busca de vagas assim que o conteúdo da página é carregado
document.addEventListener('DOMContentLoaded', () => realizarBusca(true));

// Listener para o formulário de busca
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    buscaAtual = Object.fromEntries(formData.entries());
    realizarBusca(true); // Realiza uma nova busca
});

// Listener para o botão "Carregar Mais"
btnCarregarMais.addEventListener('click', () => {
    paginaAtual++;
    realizarBusca(false); // Carrega a próxima página de resultados
});

// Inicializa o módulo de detalhes da vaga, passando os elementos e a "memória"
inicializarDetalhesVaga(vagasUl, VagasSobre, () => todasVagasCarregadas);

// Listener para o menu hamburger em telas menores
hamburger.addEventListener('click', () => {
    headerContent.classList.toggle('active');
});