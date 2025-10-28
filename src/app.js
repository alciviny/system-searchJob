const express = require('express');
const cors = require('cors');
const vagasRoutes = require('./routes/vagasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/vagas', vagasRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});