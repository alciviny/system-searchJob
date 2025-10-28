const vagasService = require('../services/vagasService');
const VagasFiltroService = require('../services/VagasFiltroService')

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

  //funcao de controle que usa a nossa funcao de filtro la do services
  static async filtrodeVagas(req,res){
    try{

      // Pega cargo, localizacao e a nova 'page' da requisição
     const {cargo, localizacao, page, data}= req.query

     // Monta o objeto de filtro, incluindo a página
     const filtro = {
        cargo: cargo || '',
        localizacao: localizacao || '',
        max_days_old: (data && data !== '0') ? data : '', // Ignora o filtro se data for '0' ou não existir
        page: parseInt(page, 10) || 1 // Garante que 'page' seja um número
     };

     //cria uma constante que vai guardar o valor da nossa funcao de filtro
      const vagasFiltro = await VagasFiltroService.filtrarvaga(filtro)

      //confirma que se existir o status é 200
      res.status(200).json(vagasFiltro)

  } catch(error){
      console.error("erro ao buscar vagas filtradas no vagafiltroservice", error)
      res.status(500).json({mensagem: 'nao foi possivel encontrar as vagas filtradas'})}}
}


module.exports = VagasController;
