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

      //pega  o cargo e localizacao como requisicoes que sao usadas no url da api
     const {cargo,localizacao}= req.query
     //cria uma constante que vai guardar o valor da nossa funcao de filtro
      const vagasFiltro = await VagasFiltroService.filtrarvaga({cargo,localizacao})
      //confirma que se existir o status é 200
      if (vagasFiltro) res.status(200).json(vagasFiltro)

  } catch(error){
      console.error("erro ao buscar vagas filtradas no vagafiltroservice", error)
      res.status(500).json({mensagem: 'nao foi possivel encontrar as vagas filtradas'})}}
}


module.exports = VagasController;
