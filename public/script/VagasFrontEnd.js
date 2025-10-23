


function  CartaoVaga(vaga){
    const card =`
     <li class="vagaLI">
                <h3 class="vaga-titulo">${vaga.titulo}</h3>
                <h4 class="vaga-empresa">${vaga.empresa}</h4>
                <p class="vaga-localizacao">${vaga.localizacao}</p>
                <p class="vaga-descricao">${vaga.descricao}</p>
                <a href="vaga-sobre">ver vaga</a>
            </li>
    `
    return card
}

async function CarregarVagas(req,res){
try{
    const VagasUl = document.querySelector('.vagasUl')
    console.log('buscando vagas na rota/ vagas')
    const response = await fetch('http://localhost:3000/vagas')
    const vagas = await response.json()

if(vagas){
    console.log('vagas encontradas')
    vagas.forEach(dado => {
        const vagacard = CartaoVaga(dado)
        VagasUl.innerHTML += vagacard})}}

catch(error){
    console.log('erro ao carregar vagas de /vagas',error)
}};
ç