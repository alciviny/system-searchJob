const axios = require('axios');


class VagasService {
    static async vaga1() {
      
        const API1_URL = "";

        try {
            console.log(`Buscando vagas na API 1: ${API1_URL}`);
           
            const response = await axios.get(API1_URL);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao se comunicar com a API 1:', error.message);
            
            throw new Error('Falha ao buscar dados da API 1');
        }
    }

    static async vaga2() {
        
        const API2_URL = "";

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
            this.vaga1(),
            this.vaga2(),
            this.vaga3()
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