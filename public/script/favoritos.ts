import { obterToken, estaAutenticado, obterHeadersAutenticacao } from './auth.js';

const FAVORITES_API_URL = '/favorites';

export interface FavoritoPayload {
  titulo: string;
  url: string;
  empresa?: string;
  localizacao?: string;
  descricao?: string;
}

export interface Favorito extends FavoritoPayload {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

export async function adicionarFavorito(dados: FavoritoPayload): Promise<Favorito> {
  const token = obterToken();
  
  if (!token) {
    throw new Error('Você precisa estar autenticado para adicionar favoritos');
  }

  const response = await fetch(FAVORITES_API_URL, {
    method: 'POST',
    headers: obterHeadersAutenticacao(),
    body: JSON.stringify(dados)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao adicionar favorito');
  }

  return await response.json();
}

export async function removerFavorito(favoriteId: string): Promise<void> {
  const token = obterToken();
  
  if (!token) {
    throw new Error('Você precisa estar autenticado para remover favoritos');
  }

  const response = await fetch(`${FAVORITES_API_URL}/${favoriteId}`, {
    method: 'DELETE',
    headers: obterHeadersAutenticacao()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao remover favorito');
  }
}

export async function listarFavoritos(): Promise<Favorito[]> {
  const token = obterToken();
  
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(FAVORITES_API_URL, {
      method: 'GET',
      headers: obterHeadersAutenticacao()
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    return [];
  }
}

const LISTENERS_MAP = new WeakMap<HTMLElement, (e: Event) => Promise<void>>();

export async function atualizarEstadoFavoritos(
  containerVagas: HTMLElement,
  favoritosDoUsuario: Favorito[]
): Promise<void> {
  const botoesFavorito = containerVagas.querySelectorAll('.btn-favoritar');
  
  botoesFavorito.forEach((btn) => {
    const vagaItem = (btn as HTMLElement).closest('.vagaLI');
    if (!vagaItem) return;
    
    const vagaUrl = vagaItem.querySelector('.vaga-botao-inscricao')?.getAttribute('href') || '';
    const jaFavorito = favoritosDoUsuario.some(fav => fav.url === vagaUrl);
    
    if (jaFavorito) {
      btn.classList.add('favorito');
    } else {
      btn.classList.remove('favorito');
    }
  });
}

export async function inicializarFavoritos(
  containerVagas: HTMLElement
): Promise<void> {
  let favoritosDoUsuario: Favorito[] = [];

  if (estaAutenticado()) {
    favoritosDoUsuario = await listarFavoritos();
  }

  const botoesFavorito = containerVagas.querySelectorAll('.btn-favoritar');

  botoesFavorito.forEach((btn: Element) => {
    const btnElement = btn as HTMLElement;
    
    if (LISTENERS_MAP.has(btnElement)) {
      return;
    }

    const vagaItem = btnElement.closest('.vagaLI') as HTMLElement;
    if (!vagaItem) return;

    const vagaTitulo = vagaItem.querySelector('.vaga-titulo')?.textContent || '';
    const vagaUrl = vagaItem.querySelector('.vaga-botao-inscricao')?.getAttribute('href') || '';
    const vagaEmpresa = vagaItem.querySelector('.vaga-empresa')?.textContent || '';
    const vagaLocalizacao = vagaItem.querySelector('.vaga-localizacao')?.textContent || '';

    const handleFavoritoClick = async (e: Event): Promise<void> => {
      e.preventDefault();

      if (!estaAutenticado()) {
        alert('Você precisa estar autenticado para adicionar favoritos');
        return;
      }

      try {
        if (btnElement.classList.contains('favorito')) {
          const favorito = favoritosDoUsuario.find(fav => fav.url === vagaUrl);
          if (favorito) {
            await removerFavorito(favorito._id);
            btnElement.classList.remove('favorito');
            favoritosDoUsuario = favoritosDoUsuario.filter(f => f._id !== favorito._id);
          }
        } else {
          await adicionarFavorito({
            titulo: vagaTitulo,
            url: vagaUrl,
            empresa: vagaEmpresa,
            localizacao: vagaLocalizacao,
            descricao: ''
          });
          btnElement.classList.add('favorito');
          favoritosDoUsuario = await listarFavoritos();
        }
      } catch (error: any) {
        alert(error.message || 'Erro ao gerenciar favorito');
      }
    };

    btnElement.addEventListener('click', handleFavoritoClick);
    LISTENERS_MAP.set(btnElement, handleFavoritoClick);
  });

  await atualizarEstadoFavoritos(containerVagas, favoritosDoUsuario);
}
