const axios = require('axios');
require('dotenv').config()

class VagasService {
    static async vagaAdzuna() {
        const appkey = process.env.ADZUNA_KEY;
        const appId = process.env.ADZUNA_ID;

        if (!appId || !appkey) {
            console.warn("credenciais da Api Adzuna nao encontradas no .env. pulando a busca");
            return [];
        }

        const params = new URLSearchParams({
            app_id: appId,
            app_key: appkey,
            results_per_page: '50',
            where: 'Brasil'.toLowerCase()
        });
        const url = `https://api.adzuna.com/v1/api/jobs/br/search/1?${params.toString()}`;

        try {
            console.log('buscando vagas na Api da Adzuna');
            const response = await axios.get(url);

            if (response.status !== 200 || !response.data || !Array.isArray(response.data.results)) {
                console.warn('resposta inesperada da Adzuna', response.status);
                return [];
            }

            const vagasEncontradas = response.data.results.map(vaga => ({
                titulo: vaga.title || '',
                empresa: vaga.company?.display_name || '',
                localizacao: vaga.location?.display_name || '',
                url: vaga.redirect_url || '',
                descricao: vaga.description || "",
                contrato: vaga.contract_time || "",
                data: vaga.created || ""
                
            }));

            console.log(`numero de vagas encontradas: ${vagasEncontradas.length}`);
            return vagasEncontradas;
        } catch (error) {
            console.error('nao conseguimos entrar na api da adzuna, verifique possiveis causas', error);
            return [];
        }
        
    }

    static async vaga2() {
        
     
        try {
            console.log(`Buscando vagas na API 2: ${API2_URL}`);
      
            const response = await axios.get(API2_URL);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao se comunicar com a API 2:', error.message);
            throw new Error('Falha ao buscar dados da API 2');
        }
    }

    static async vaga3() {
       
        const API3_URL = "";

        try {
            console.log(`Buscando vagas na API 3: ${API3_URL}`);
            const response = await axios.get(API3_URL);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao se comunicar com a API 3:', error.message);
            throw new Error('Falha ao buscar dados da API 3');
        }
    }

    static async todasVagas() {
        console.log('Iniciando busca de todas as vagas...');

        const responses = await Promise.allSettled([
            this.vagaAdzuna()
        ]);

        console.log('Processando resultados das APIs...');


        const vagasAgregadas = responses
            .filter(res => res.status === 'fulfilled' && res.value)
            .flatMap(res => res.value);

        console.log(`Encontramos um total de ${vagasAgregadas.length} vagas.`);
        return vagasAgregadas;
    }

  
}

module.exports = VagasService;