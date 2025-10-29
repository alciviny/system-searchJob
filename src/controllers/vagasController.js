const vagasService = require('../services/vagasService');

// =================================================================
// CONTROLADOR DE VAGAS
// =================================================================
class VagasController {
 
  // --- Método para Busca Inicial (sem filtros) ---
  static async obterVagas(req, res) {
    try {
      const vagas = await vagasService.buscarVagas();
      res.status(200).json(vagas);
    } catch (error) {
      console.error('Erro no controller ao obter vagas:', error);
      res.status(500).json({ message: 'Não foi possível obter as vagas.' });
    }
  }
  
  // --- Método para Busca Filtrada ---
  static async filtrodeVagas(req,res){
    try{
     const { cargo, localizacao, page, data, contrato } = req.query;
     const filtro = {
        cargo: cargo || '',
        localizacao: localizacao || '',
        contrato: contrato || '',
        max_days_old: (data && data !== '0') ? data : '',
        page: parseInt(page, 10) || 1
     };
      const vagasFiltro = await vagasService.buscarVagas(filtro)
      res.status(200).json(vagasFiltro)
  } catch(error){
      console.error("Erro ao buscar vagas filtradas no controller:", error)
      res.status(500).json({mensagem: 'nao foi possivel encontrar as vagas filtradas'})}}
}

module.exports = VagasController;
