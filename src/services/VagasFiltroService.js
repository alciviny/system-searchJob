const axios = require('axios');
require('dotenv').config();

// =================================================================
// SERVIÇO DE FILTRO DE VAGAS
// =================================================================
class VagasFiltroService {
    // --- API 1: Adzuna ---
    static async filtrarAdzuna({ cargo, localizacao, contrato, max_days_old, page = 1 }) {
        const Ad_Key = process.env.ADZUNA_KEY;
        const Ad_Id = process.env.ADZUNA_ID;
        if (!Ad_Id || !Ad_Key) {
            console.warn('Credenciais da Adzuna não encontradas. Pulando busca.');
            return [];
        }

        const params = new URLSearchParams({
            app_id: Ad_Id,
            app_key: Ad_Key,
            results_per_page: '50',
        });

        if (cargo) params.append('what', cargo.toLowerCase());
        if (localizacao) params.append('where', localizacao.toLowerCase());
        if (contrato) params.append(contrato, '1');

        if (max_days_old && Number(max_days_old) > 0) params.append('max_days_old', max_days_old);

        const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;

        try {
            console.log('Filtrando vagas na Adzuna...');
            const response = await axios.get(url);
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
            console.error('Erro ao filtrar na API Adzuna:', error.message);
            return [];
        }
    }

    // --- API 2: jsearch (RapidAPI) ---
    static async filtrarRapidAPI({ cargo, localizacao, contrato }) {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const rapidApiHost = process.env.RAPIDAPI_HOST;

        if (!rapidApiKey || !rapidApiHost) {
            console.warn("Chave ou Host da RapidAPI (jsearch) não encontrados. Pulando filtro.");
            return [];
        }
        let queryParts = [];
        if (cargo) queryParts.push(cargo);
        if (contrato) queryParts.push(contrato);
        if (queryParts.length === 0) queryParts.push('vaga'); // Se nenhum filtro for usado, busca por "vaga"

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
            console.log('Filtrando vagas na jsearch (RapidAPI)...');
            console.log(`Query enviada para jsearch: '${query}'`);
            const response = await axios.request(options);

            if (!response.data || !Array.isArray(response.data.data)) {
                console.warn('Resposta da jsearch API não continha um array de vagas em "data".');
                return [];
            }

            const vagasEncontradas = (response.data.data || []).map(vaga => ({
                titulo: vaga.job_title,
                empresa: vaga.employer_name || 'Não informado',
                localizacao: `${vaga.job_city || ''}, ${vaga.job_state || ''}, ${vaga.job_country || ''}`.replace(/^, |, $/g, ''),
                url: vaga.job_apply_link || `https://www.google.com/search?q=${encodeURIComponent(vaga.job_title + ' ' + vaga.employer_name)}`,
                descricao: vaga.job_description || "Descrição não disponível.",
                contrato: vaga.job_employment_type || "Não especificado",
                data: vaga.job_posted_at_datetime_utc || new Date().toISOString(),
                fonte: 'jsearch'
            }));

            console.log(`[SUCESSO] RapidAPI retornou ${vagasEncontradas.length} vagas para a busca.`);
            return vagasEncontradas;

        } catch (error) {
            console.error('[ERRO] Falha ao filtrar na jsearch (RapidAPI):', error.response ? JSON.stringify(error.response.data) : error.message);
            return [];
        }
    }

    // --- Orquestrador Principal ---
    static async filtrarvaga(filtros) {
        try {
            const [vagasAdzuna, vagasRapidAPI] = await Promise.all([
                this.filtrarAdzuna(filtros),
                this.filtrarRapidAPI(filtros)
            ]);

            let vagasAgregadas = [...vagasAdzuna, ...vagasRapidAPI];
            vagasAgregadas.sort((a, b) => new Date(b.data) - new Date(a.data));
            
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
            console.error('Erro ao agregar vagas filtradas:', error);
            return [];
        }
    }
}

module.exports = VagasFiltroService;