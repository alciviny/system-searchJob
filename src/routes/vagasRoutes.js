const express = require("express")

const routes= express.Router();
const VagasController= require('../controllers/vagasController');

routes.get('/',VagasController.obterVagas)
routes.get('/filtrar',VagasController.filtrodeVagas)


module.exports=routes;
