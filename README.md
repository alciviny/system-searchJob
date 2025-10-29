# Sistema VagaBot

Um agregador de vagas de emprego que consome múltiplas APIs para centralizar as oportunidades em uma única interface. Este é o backend do projeto, construído com Node.js e Express.

---

## 🚀 Estrutura do Projeto

O backend segue uma arquitetura modular e organizada, inspirada em padrões como MVC, para garantir escalabilidade e manutenibilidade.

- **`/src`**: Contém todo o código-fonte da aplicação.

  - **`/config`**: Arquivos de configuração, como conexão com banco de dados e variáveis de ambiente.

  - **`/controllers`**: Recebem as requisições das rotas, validam os dados e orquestram a resposta, chamando os serviços necessários.

  - **`/middlewares`**: Funções executadas entre a requisição e o controlador, usadas para tarefas como autenticação, logging, etc.

  - **`/models`**: Definição dos esquemas de dados (ex: Mongoose Schemas), representando a estrutura dos dados no banco.

  - **`/routes`**: Mapeamento de todos os endpoints (URLs) da API para os seus respectivos controladores.

  - **`/services`**: Contém a lógica de negócio principal. É aqui que a comunicação com APIs externas e a manipulação de dados complexos acontecem.

  - **`/views`**: Usada para renderização de templates no servidor (não utilizada em APIs REST puras).

---

## 🛠️ Como Executar

Para instruções sobre como configurar e executar o projeto localmente, consulte o guia de contribuição:

➡️ **Como Contribuir para o Sistema VagaBot**
