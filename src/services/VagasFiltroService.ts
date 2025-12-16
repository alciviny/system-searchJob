import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface Filtro {
  cargo?: string;
  localizacao?: string;
  contrato?: string;
  max_days_old?: string;
  page?: number;
}

interface Vaga {
  titulo: string;
  empresa: string;
  localizacao: string;
  url: string;
  descricao: string;
  contrato: string;
  data: string;
  fonte: string;
}

interface AdzunaCompany {
  display_name?: string;
}

interface AdzunaLocation {
  display_name?: string;
}

interface AdzunaJobResponse {
  title?: string;
  company?: AdzunaCompany;
  location?: AdzunaLocation;
  redirect_url?: string;
  description?: string;
  contract_time?: string;
  created?: string;
}

interface AdzunaApiResponse {
  results?: AdzunaJobResponse[];
}

interface RapidApiJobResponse {
  job_title: string;
  employer_name?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_apply_link?: string;
  job_description?: string;
  job_employment_type?: string;
  job_posted_at_datetime_utc?: string;
}

interface RapidApiResponse {
  data?: RapidApiJobResponse[];
}

class VagasFiltroService {
  static async filtrarAdzuna(filtro: Filtro): Promise<Vaga[]> {
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

    if (filtro.cargo) params.append('what', filtro.cargo.toLowerCase());
    if (filtro.localizacao) params.append('where', filtro.localizacao.toLowerCase());
    if (filtro.contrato) params.append(filtro.contrato, '1');
    if (filtro.max_days_old && Number(filtro.max_days_old) > 0) {
      params.append('max_days_old', filtro.max_days_old);
    }

    const page = filtro.page || 1;
    const url = `https://api.adzuna.com/v1/api/jobs/br/search/${page}?${params.toString()}`;

    try {
      console.log('Filtrando vagas na Adzuna...');
      const response = await axios.get<AdzunaApiResponse>(url);
      
      return (response.data.results || []).map((vaga: AdzunaJobResponse) => ({
        titulo: vaga.title || '',
        empresa: vaga.company?.display_name || '',
        localizacao: vaga.location?.display_name || '',
        url: vaga.redirect_url || '',
        descricao: vaga.description || '',
        contrato: vaga.contract_time || '',
        data: vaga.created || '',
        fonte: 'Adzuna'
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao filtrar na API Adzuna:', errorMessage);
      return [];
    }
  }

  static async filtrarRapidAPI(filtro: Filtro): Promise<Vaga[]> {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;

    if (!rapidApiKey || !rapidApiHost) {
      console.warn('Chave ou Host da RapidAPI (jsearch) não encontrados. Pulando filtro.');
      return [];
    }
    
    let queryParts: string[] = [];
    if (filtro.cargo) queryParts.push(filtro.cargo);
    if (filtro.contrato) queryParts.push(filtro.contrato);
    if (queryParts.length === 0) queryParts.push('vaga');

    const query = `${queryParts.join(' ')} em ${filtro.localizacao || 'brasil'}`;

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
      const response = await axios.request<RapidApiResponse>(options);

      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Resposta da jsearch API não continha um array de vagas em "data".');
        return [];
      }

      const vagasEncontradas = (response.data.data || []).map((vaga: RapidApiJobResponse) => ({
        titulo: vaga.job_title,
        empresa: vaga.employer_name || 'Não informado',
        localizacao: `${vaga.job_city || ''}, ${vaga.job_state || ''}, ${vaga.job_country || ''}`.replace(/^, |, $/g, ''),
        url: vaga.job_apply_link || `https://www.google.com/search?q=${encodeURIComponent(vaga.job_title + ' ' + (vaga.employer_name || ''))}`,
        descricao: vaga.job_description || 'Descrição não disponível.',
        contrato: vaga.job_employment_type || 'Não especificado',
        data: vaga.job_posted_at_datetime_utc || new Date().toISOString(),
        fonte: 'jsearch'
      }));

      console.log(`[SUCESSO] RapidAPI retornou ${vagasEncontradas.length} vagas para a busca.`);
      return vagasEncontradas;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[ERRO] Falha ao filtrar na jsearch (RapidAPI):', errorMessage);
      return [];
    }
  }

  static async filtrarvaga(filtros: Filtro): Promise<Vaga[]> {
    try {
      const [vagasAdzuna, vagasRapidAPI] = await Promise.all([
        this.filtrarAdzuna(filtros),
        this.filtrarRapidAPI(filtros)
      ]);

      let vagasAgregadas = [...vagasAdzuna, ...vagasRapidAPI];
      vagasAgregadas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      const vagasUnicas: Vaga[] = [];
      const titulosVistos = new Set<string>();
      
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

export default VagasFiltroService;
