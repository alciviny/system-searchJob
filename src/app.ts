import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config'; 

// Importação das rotas
import vagasRoutes from './routes/vagasRoutes';
import authRoutes from './routes/authRoutes';
import favoritesRoutes from './routes/favoritesRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Conexão com o Banco de Dados MongoDB ---
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('ERRO: MONGODB_URI não definida no arquivo .env');
  process.exit(1); 
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado com sucesso.'))
  .catch(err => {
    console.error('Erro ao conectar com o MongoDB:', err);
    process.exit(1);
  });
// -----------------------------------------

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- Registro das Rotas da Aplicação ---
app.use('/vagas', vagasRoutes);
app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes); 
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
