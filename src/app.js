const express = require('express');
const cors = require('cors');
const vagasRoutes = require('./routes/vagasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.use(express.json());


app.use('/vagas', vagasRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

module.exports = app;