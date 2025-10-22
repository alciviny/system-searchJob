const vagasService = require('../services/vagasService');

class VagasController {
 
  static async obterVagas(req, res) {
    try {
      
      const vagas = await vagasService.todasVagas();

      res.status(200).json(vagas);

    } catch (error) {
      console.error('Erro no controller ao obter vagas:', error);
      
      res.status(500).json({ message: 'Não foi possível obter as vagas.' });
    }
  }
}

module.exports = VagasController;
