import express from 'express';
import VagasController from '../controllers/vagasController';

const routes = express.Router();

routes.get('/', VagasController.obterVagas);
routes.get('/filtrar', VagasController.filtrarVagas);

export default routes;
