import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Criamos e exportamos uma interface para requisições que passaram pela autenticação
export interface AuthenticatedRequest extends Request {
  userId: string; // A propriedade userId é obrigatória neste tipo
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token em formato inválido (ex: "Bearer <token>").' });
  }

  const token = parts[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET não foi definido nas variáveis de ambiente.');
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    
    // 2. Fazemos um "cast" da requisição para o nosso tipo e atribuímos o ID
    (req as AuthenticatedRequest).userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
