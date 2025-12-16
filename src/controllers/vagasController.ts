import { Request, Response } from 'express';
import vagasService from '../services/vagasService';

class VagasController {
  private static sanitizeInput(input: string): string {
    return input.trim().substring(0, 100);
  }

  private static isValidPage(page: any): number {
    const pageNum = parseInt(page as string, 10);
    return pageNum > 0 ? pageNum : 1;
  }

  static async obterVagas(req: Request, res: Response): Promise<void> {
    try {
      const vagas = await vagasService.buscarVagas();
      res.status(200).json(vagas);
    } catch (error) {
      console.error('Erro no controller ao obter vagas:', error);
      res.status(500).json({ message: 'Não foi possível obter as vagas.' });
    }
  }

  static async filtrarVagas(req: Request, res: Response): Promise<void> {
    try {
      const { cargo, localizacao, page, data, contrato } = req.query;

      const filtro = {
        cargo: cargo ? VagasController.sanitizeInput(cargo as string) : '',
        localizacao: localizacao ? VagasController.sanitizeInput(localizacao as string) : '',
        contrato: contrato ? VagasController.sanitizeInput(contrato as string) : '',
        max_days_old: (data && data !== '0') ? VagasController.sanitizeInput(data as string) : '',
        page: VagasController.isValidPage(page)
      };

      const vagasFiltro = await vagasService.buscarVagas(filtro);
      res.status(200).json(vagasFiltro);
    } catch (error) {
      console.error('Erro ao buscar vagas filtradas no controller:', error);
      res.status(500).json({ message: 'Não foi possível encontrar as vagas filtradas.' });
    }
  }
}

export default VagasController;
