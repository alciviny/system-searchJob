const axios = require('axios');
require('dotenv').config()

// =================================================================
// SERVIÇO DE BUSCA DE VAGAS
// =================================================================
class VagasService {
    // --- API 1: Adzuna ---
    static async vagaAdzuna({ cargo, localizacao, contrato, max_days_old, page = 1 }) {
        const appkey = process.env.ADZUNA_KEY;
        const appId = process.env.ADZUNA_ID;
        if (!appId || !appkey) {
            console.warn("Credenciais da Adzuna não encontradas no .env. Pulando a busca.");
            return [];
        }

        const params = new URLSearchParams({
            app_id: appId,
            app_key: appkey,
            results_per_page: '50',
        });

        if (cargo) params.append('what', cargo.toLowerCase());
        if (localizacao) params.append('where', localizacao.toLowerCase());
        if (contrato) params.append(contrato, '1'); // Adzuna usa o tipo de contrato como chave (ex: full_time=1)
        if (max_days_old && Number(max_days_old) > 0) params.append('max_days_old', max_days_old);

        const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;

        try {
            console.log('Buscando vagas na API da Adzuna...');
            const response = await axios.get(url);

            if (response.status !== 200 || !response.data || !Array.isArray(response.data.results)) {
                console.warn('Resposta inesperada da Adzuna', response.status);
                return [];
            }

            return (response.data.results || []).map(vaga => ({
                titulo: vaga.title || '',
                empresa: vaga.company?.display_name || '',
                localizacao: vaga.location?.display_name || '',
                url: vaga.redirect_url || '',
                descricao: vaga.description || "",
                contrato: vaga.contract_time || "",
                data: vaga.created || "",
                fonte: 'Adzuna'
            }));
        } catch (error) {
            console.error('Erro ao buscar na API Adzuna:', error.message);
            return [];
        }
    }

    // --- API 2: jsearch (RapidAPI) ---
    static async vagaRapidAPI({ cargo, localizacao, contrato }) {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const rapidApiHost = process.env.RAPIDAPI_HOST;
        if (!rapidApiKey || !rapidApiHost) {
            console.warn("Chave ou Host da RapidAPI (jsearch) não encontrados no .env. Pulando a busca.");
            return [];
        }

        let queryParts = [];
        if (cargo) queryParts.push(cargo);
        if (contrato) queryParts.push(contrato);
        if (queryParts.length === 0) queryParts.push('vaga'); // Busca padrão se nenhum filtro for usado

        const query = `${queryParts.join(' ')} em ${localizacao || 'brasil'}`;

        const options = {
            method: 'GET',
            url: `https://${rapidApiHost}/search`,
            params: {
                query: query,
                page: '1',
                num_pages: '5'
            },
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': rapidApiHost
            }
        };

        try {
            console.log('Buscando vagas na jsearch (RapidAPI)...');
            console.log(`Query enviada para jsearch: '${query}'`);
            const response = await axios.request(options);

            if (response.status !== 200 || !response.data || !Array.isArray(response.data.data)) {
                console.warn('Resposta inesperada da jsearch API', response.status);
                return [];
            }

            return (response.data.data || []).map(vaga => ({
                titulo: vaga.job_title,
                empresa: vaga.employer_name || 'Não informado',
                localizacao: `${vaga.job_city || ''}, ${vaga.job_state || ''}, ${vaga.job_country || ''}`.replace(/^, |, $/g, ''),
                url: vaga.job_apply_link || `https://www.google.com/search?q=${encodeURIComponent(vaga.job_title + ' ' + vaga.employer_name)}`,
                descricao: vaga.job_description || "Descrição não disponível.",
                contrato: vaga.job_employment_type || "Não especificado",
                data: vaga.job_posted_at_datetime_utc || new Date().toISOString(),
                fonte: 'jsearch'
            }));
        } catch (error) {
            console.error('[ERRO] Falha ao buscar na jsearch (RapidAPI):', error.response ? JSON.stringify(error.response.data) : error.message);
            return [];
        }
    }

    // --- Orquestrador Principal ---
    static async buscarVagas(filtros = {}) {
        try {
            const [vagasAdzuna, vagasRapidAPI] = await Promise.all([
                this.vagaAdzuna(filtros),
                this.vagaRapidAPI(filtros)
            ]);

            let vagasAgregadas = [...vagasAdzuna, ...vagasRapidAPI];

            // Processamento dos resultados combinados
            vagasAgregadas.sort((a, b) => new Date(b.data) - new Date(a.data));
            
            // Remoção de duplicatas
            const vagasUnicas = [];
            const titulosVistos = new Set();
            for (const vaga of vagasAgregadas) {
                const identificador = `${vaga.titulo.toLowerCase()}|${vaga.empresa.toLowerCase()}`;
                if (!titulosVistos.has(identificador)) {
                    titulosVistos.add(identificador);
                    vagasUnicas.push(vaga);
                }
            }

            console.log(`Total de vagas filtradas e únicas encontradas: ${vagasUnicas.length}`);
            return vagasUnicas;
        } catch (error) {
            console.error('Erro ao agregar e processar vagas:', error);
            return [];
        }
    }
}

module.exports = VagasService;