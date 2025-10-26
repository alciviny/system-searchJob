const formulario = document.querySelector('.search-container')

function  CartaoVaga(vaga){
    const card =`
     <li class="vagaLI">
                <h3 class="vaga-titulo">${vaga.titulo}</h3>
                <h4 class="vaga-empresa">${vaga.empresa}</h4>
                <p class="vaga-localizacao">${vaga.localizacao}</p>
                <p class="vaga-data">${vaga.data}</p>
                <p class="vaga-sobre"><button>saiba mais</button></p>
            </li>
    `
    return card} 
/*  <p class="vaga-descricao">${vaga.descricao}</p>
<p class="vaga-descricao">${vaga.contrato}</p> */
/*  */
async function CarregarVagas(){
try{
    const VagasUl = document.querySelector('.vagasUl')
    console.log('buscando vagas na rota/ vagas')
    const response = await fetch('http://localhost:3000/vagas')
    const vagas = await response.json()



if(vagas){
    console.log(vagas)
    VagasUl.innerHTML = ''; // Limpa o conteúdo de exemplo
    console.log('vagas encontradas')
    vagas.forEach(dado => {
        const vagacard = CartaoVaga(dado)
        VagasUl.innerHTML += vagacard})}}

catch(error){
    console.log('erro ao carregar vagas de /vagas',error)
}};


formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const params = new URLSearchParams(data);
    const queryString = params.toString();

    fetch(`http://localhost:3000/vagas/filtrar?${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('A resposta da rede não foi OK. Status: ' + response.status);
            }
            return response.json();
        })
        .then(vagasfiltradas => {
            const vagasUl = document.querySelector('.vagasUl');
            vagasUl.innerHTML = '';

            if (vagasfiltradas.length === 0) {
                vagasUl.innerHTML = `<li>Nenhuma vaga encontrada para esta busca</li>`;
                return;
            }
            vagasfiltradas.forEach(vaga => {
                const vagacard = CartaoVaga(vaga);
                vagasUl.innerHTML += vagacard;
            });
        })
        .catch(error => {
            console.error('Erro ao buscar vagas filtradas:', error);
            const vagasUl = document.querySelector('.vagasUl');
            vagasUl.innerHTML = `<li>Ocorreu um erro ao buscar as vagas. Verifique o console.</li>`;
        });
});
document.addEventListener('DOMContentLoaded', CarregarVagas);