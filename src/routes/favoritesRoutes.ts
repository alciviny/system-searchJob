import { Router, RequestHandler } from 'express';
import favoritesController from '../controllers/favoritesController';
import authMiddleware from '../middlewares/authMiddleware';

const favoritesRoutes = Router();

// Aplica o middleware de autenticação a TODAS as rotas definidas abaixo neste arquivo.
favoritesRoutes.use(authMiddleware);

// GET / - Lista os favoritos do usuário logado
favoritesRoutes.get('/', favoritesController.listarFavoritos as unknown as RequestHandler);

// POST / - Adiciona um novo favorito para o usuário logado
favoritesRoutes.post('/', favoritesController.adicionarFavorito as unknown as RequestHandler);

// DELETE /:favoriteId - Remove um favorito específico do usuário logado
favoritesRoutes.delete('/:favoriteId', favoritesController.removerFavorito as unknown as RequestHandler);

export default favoritesRoutes;
