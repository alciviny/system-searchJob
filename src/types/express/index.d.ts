// Este arquivo utiliza uma técnica chamada "declaration merging" do TypeScript
// para adicionar de forma segura uma nova propriedade ao tipo Request do Express.

declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
