# Como Contribuir para o Sistema VagaBot

## 1. Configuração do Ambiente Local

Siga estes passos para ter uma cópia do projeto rodando em sua máquina.

**1.1. Clone o Repositório:**

Use o seguinte comando para clonar o projeto:
```bash
git clone git@github.com:alciviny/sistema-vagaBot.git
```

**1.2. Navegue até a Pasta:**
```bash
cd sistema-vagaBot
```

**1.3. Instale as Dependências:**

O projeto usa NPM para gerenciar os pacotes. Rode o comando abaixo para instalar tudo o que é necessário:
```bash
npm install
```

Após esses passos, seu ambiente estará pronto para o desenvolvimento.

---

## 2. Fluxo de Trabalho e Padrões de Versionamento

Para manter o projeto organizado e o histórico de alterações claro, seguimos um fluxo de trabalho baseado em *feature branches* e o padrão **Conventional Commits**.

### 2.1. Nomenclatura de Branches

Toda nova funcionalidade ou correção deve ser feita em uma nova branch, criada a partir da branch `master`. Nunca faça commits diretamente na `master`.

Use o seguinte padrão para nomear sua branch:

`tipo/escopo-da-tarefa`

**Tipos comuns:**
- **`feat`**: Para uma nova funcionalidade (Ex: `feat/autenticacao-de-usuario`).
- **`fix`**: Para a correção de um bug (Ex: `fix/erro-no-login`).
- **`docs`**: Para alterações na documentação (Ex: `docs/atualizar-readme`).
- **`style`**: Para ajustes de formatação e estilo de código (Ex: `style/formatar-codigo-controller`).
- **`refactor`**: Para refatoração de código que não altera a funcionalidade (Ex: `refactor/simplificar-funcao-de-busca`).
- **`chore`**: Para tarefas de manutenção, como atualização de dependências (Ex: `chore/atualizar-express`).

**Exemplo de criação de branch:**
```bash
git checkout -b feat/cadastro-de-empresas
```

### 2.2. Padrão de Commits (Conventional Commits)

Adotamos o padrão **Conventional Commits** para as mensagens de commit. Isso nos ajuda a gerar changelogs automaticamente e a entender rapidamente o que cada alteração faz.

O formato é:

`tipo(escopo opcional): descrição curta em letra minúscula`

**Exemplos de mensagens de commit:**

- **feat**: `feat(api): adiciona endpoint para criação de usuários`
- **fix**: `fix(auth): corrige validação de token expirado`
- **docs**: `docs(contributing): adiciona guia de nomenclatura de branches`
- **chore**: `chore: atualiza versão do jest para a 29.0`

### 2.3. Enviando sua Contribuição (Pull Request)

1.  Após finalizar suas alterações e commits na sua branch, envie-a para o repositório remoto:
    ```bash
    git push origin feat/sua-branch
    ```
2.  Abra o GitHub e crie um **Pull Request (PR)** da sua branch para a branch `master`.
3.  No PR, descreva o que você fez e por quê. Se o PR resolve uma *Issue* existente, mencione o número dela (ex: `Resolve #42`).

