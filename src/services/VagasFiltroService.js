const axios = require('axios');
require('dotenv').config();

class VagasFiltroService {
    static async filtrarvaga({ cargo, localizacao, max_days_old, page = 1 }) {
        const Ad_Key = process.env.ADZUNA_KEY;
        const Ad_Id = process.env.ADZUNA_ID;

        if (!Ad_Id || !Ad_Key) {
            console.warn('Credenciais da API Adzuna não encontradas no arquivo .env.');
            return [];
        }

        const params = new URLSearchParams({
            app_id: Ad_Id,
            app_key: Ad_Key,
            results_per_page: '100',
        });

        if (cargo) params.append('what', cargo.toLowerCase());
        if (localizacao) params.append('where', localizacao.toLowerCase());
        // Adiciona o filtro de data apenas se for um número válido e maior que 0
        if (max_days_old && Number(max_days_old) > 0) params.append('max_days_old', max_days_old);

        const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;
        console.log('URL enviado para a Adzuna:', url);

        try {
            const response = await axios.get(url);

            if (response.status !== 200 || !response.data || !response.data.results) {
                console.warn('Resposta inesperada da API Adzuna. Status:', response.status);
                return [];
            }

            const vagasFiltradas = response.data.results.map(vaga => ({
                titulo: vaga.title || '',
                empresa: vaga.company?.display_name || '',
                localizacao: vaga.location?.display_name || '',
                url: vaga.redirect_url || '',
                descricao: vaga.description || "", 
                contrato: vaga.contract_time || "",
                data: vaga.created || ""
            }));
            return vagasFiltradas;
        } catch (error) {
            console.error('Erro ao buscar na API Adzuna:', error.message);
            return [];
        }
    }
}

module.exports = VagasFiltroService;