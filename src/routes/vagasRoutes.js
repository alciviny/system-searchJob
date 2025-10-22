const express = require("express")

const routes= express.Router();
const VagasController= require('../controllers/vagasController');

routes.get('/',VagasController.obterVagas)


module.exports=routes;
