//chamei as dependencias que vou trabalhar 
const axios = require('axios');
require ('dotenv').config()

//criei a classe que vou usar no controller pra filtrar vagas
class VagasFiltroService{
    static async filtrarvaga({cargo,localizacao}){
        //puxei aqui a chave e o id la do .env que sao necessarias pra autenticar a api
        const Ad_Key = process.env.ADZUNA_KEY;
        const Ad_Id = process.env.ADZUNA_ID;
    
        //to lancando aqui a condicao pra prosseguir apos verificar que esses dados foram encontrados
     if(!Ad_Id || !Ad_Key) {console.warn('nao encontramos a chave/id da api ADZUNA'); return []}

     //aqui no paramns ele vai ter o urlsearch e vamos adicionar nossa chave  id no paramentro
     const params = new  URLSearchParams({
        app_id:Ad_Id,
        app_key:Ad_Key,
        results_per_page:'100',
        
     })

// é lancado toda a condicao pra verificar se existe de fato aquele argumento e sim, é adicionado no params
     if(cargo)params.append('what',cargo.toLowerCase())

     if(localizacao) params.append('where',localizacao.toLowerCase())

        //criamos aqui o url da nossa api adzuna, e adicionamos o params nele,interessante esse metodo
        //o url foi modificado com a adicao do nossos parametros la no url search
     const url = `https://api.adzuna.com/v1/api/jobs/br/search/1?${params.toString()}`
     console.log('url enviado para a Adzuna',url)
     //a try serve pra verificar de fato se o url foi encontrado, usamos o axios aqui,
     try{
        const response =await axios.get(url)

        //lancamos nova condicao de verificacao se a api foi encontrada, atraves do status e se ela tem dados, interessante tambem
        if(response.status !== 200 || !response.data || !response.data.results){
            console.warn; 
            return []}
            //tendo confirmado que existe, adicionamos o metodo maps pra adicionar cada valor referente em cada key, que vai ser posteriormente usada
            //em nossos cartoes la no html
           const vagasFiltradas = response.data.results.map(vaga =>({
             titulo: vaga.title || '',
                empresa: vaga.company?.display_name || '',
                localizacao: vaga.location?.display_name || '',
                url: vaga.redirect_url || '',
                   descricao: vaga.description || "",
                /*    salarioMinimo: vaga.salary.min || "",
                   salarioMaximo: vaga.salary.max || "", */
                   contrato: vaga.contract_time || "",
                   data: vaga.created || ""

           }))
          console.log(vagasFiltradas)
           return vagasFiltradas
     }catch(error){
        console.error('Erro ao buscar na API Adzuna:', error)
        return []
     }
}}

module.exports = VagasFiltroService