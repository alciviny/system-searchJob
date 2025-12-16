import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Função auxiliar para gerar o token JWT
function generateToken(id: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // Em produção, é melhor logar o erro e lançar uma exceção mais genérica
    throw new Error('Variável de ambiente JWT_SECRET não está definida.');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: 86400, // Expira em 24 horas (em segundos)
  });
}

class AuthController {
  // --- MÉTODO DE REGISTRO ---
  public async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
      }

      if (await User.findOne({ email })) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
      }

      const user = await User.create({ name, email, password });

      // Oculta a senha da resposta
      user.password = undefined as any;

      const token = generateToken(user.id);
      return res.status(201).json({ user, token });

    } catch (error: any) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ message: 'Falha no registro, tente novamente.', error: error.message });
    }
  }

  // --- MÉTODO DE LOGIN ---
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
      }

      // Busca o usuário e força a inclusão da senha na busca
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Credenciais inválidas.' });
      }

      user.password = undefined as any;

      const token = generateToken(user.id);
      return res.status(200).json({ user, token });

    } catch (error: any) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Falha no login, tente novamente.', error: error.message });
    }
  }
}

export default new AuthController();
