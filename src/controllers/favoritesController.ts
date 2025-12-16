import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import Favorite, { IFavorite } from '../models/Favorite';

class FavoritesController {
  // --- ADICIONAR UM NOVO FAVORITO ---
  public async adicionarFavorito(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.userId; // Injetado pelo authMiddleware
    const vagaData: Omit<IFavorite, 'user'> = req.body;

    try {
      // Validação básica dos dados da vaga
      if (!vagaData.titulo || !vagaData.url) {
        return res.status(400).json({ message: 'Título e URL da vaga são obrigatórios.' });
      }

      // Verifica se a vaga já foi favoritada por este usuário (usando a URL como identificador)
      const existingFavorite = await Favorite.findOne({ user: userId, url: vagaData.url });
      if (existingFavorite) {
        return res.status(409).json({ message: 'Esta vaga já está nos seus favoritos.' }); // 409 Conflict
      }

      // Cria o novo favorito associado ao usuário
      const novoFavorito = await Favorite.create({
        ...vagaData,
        user: userId, // Adiciona a referência ao usuário
      });

      return res.status(201).json(novoFavorito);

    } catch (error: any) {
      console.error('Erro ao adicionar favorito:', error);
      return res.status(500).json({ message: 'Falha ao adicionar favorito.', error: error.message });
    }
  }

  // --- LISTAR OS FAVORITOS DO USUÁRIO AUTENTICADO ---
  public async listarFavoritos(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.userId;

    try {
      // Busca todos os favoritos que pertencem ao usuário e ordena pelos mais recentes
      const favoritos = await Favorite.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(200).json(favoritos);

    } catch (error: any) {
      console.error('Erro ao listar favoritos:', error);
      return res.status(500).json({ message: 'Falha ao buscar favoritos.', error: error.message });
    }
  }

  // --- (Opcional) REMOVER UM FAVORITO ---
  public async removerFavorito(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.userId;
    const { favoriteId } = req.params; // O ID do favorito virá pela URL, ex: /favorites/someFavoriteId

    try {
      const favorito = await Favorite.findById(favoriteId);

      // Verifica se o favorito existe e se pertence ao usuário que está tentando remover
      if (!favorito) {
        return res.status(404).json({ message: 'Favorito não encontrado.' });
      }

      // Atenção na conversão de tipos ObjectId para string para comparação
      if (String(favorito.user) !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para remover este favorito.' }); // 403 Forbidden
      }

      await favorito.deleteOne();

      return res.status(200).json({ message: 'Favorito removido com sucesso.' });

    } catch (error: any) {
      console.error('Erro ao remover favorito:', error);
      return res.status(500).json({ message: 'Falha ao remover favorito.', error: error.message });
    }
  }
}

export default new FavoritesController();
