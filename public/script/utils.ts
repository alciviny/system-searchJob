export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  localizacao: string;
  url: string;
  descricao: string;
  contrato: string;
  data: string;
  fonte: string;
  salario?: string;
}

export function traduzirContrato(tipoContrato: string): string {
  if (!tipoContrato) return '';
  const contratoLower = tipoContrato.toLowerCase();

  switch (contratoLower) {
    case 'full_time':
    case 'full time':
    case 'full-time':
      return 'Tempo Integral';
    case 'part_time':
    case 'part time':
    case 'part-time':
      return 'Meio Período';
    case 'internship':
      return 'Estágio';
    default:
      return tipoContrato;
  }
}
