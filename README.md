# 🌐 ConnectHub: API de Gestão Colaborativa

O **ConnectHub** é um ecossistema completo e full-stack desenvolvido para solucionar as limitações de armazenamento local (`LocalStorage`), permitindo que múltiplos usuários gerenciem e sincronizem seus dados de forma persistente, segura e colaborativa na nuvem a partir de qualquer dispositivo.

Este projeto consolida o encerramento do ciclo de fundamentos de engenharia de software para a residência de TI, integrando interfaces dinâmicas a uma arquitetura backend robusta.

---

## 🎯 Escopo e Funcionalidades do Sistema

### Requisitos Funcionais (RF)

- **Cadastro de Usuários:** Permite a criação de novas credenciais com validação de e-mail exclusivo.
- **Autenticação Segura:** Fluxo de login completo com geração de tokens para controle de sessão.
- **Isolamento de Dados:** Garante que um usuário autenticado visualize, crie ou exclua estritamente os seus próprios registros.
- **Persistência Remota:** Todas as transações e modificações são refletidas e gravadas em tempo real no banco de dados.

### Requisitos Não Funcionais (RNF) & Segurança

- **Proteção de Credenciais:** As senhas dos usuários nunca trafegam ou são armazenadas em texto puro, aplicando criptografia hash com **Bcrypt**.
- **Muralha de Segurança (Autenticação):** Controle de acesso de rotas privadas via tokens **JWT (JSON Web Tokens)**.
- **Prevenção de Dados Órfãos:** Configuração de integridade referencial com remoção em cascata se um perfil for excluído.
- **Tratamento de Exceções:** Retornos estruturados através de HTTP Status Codes apropriados (`201 Created`, `401 Unauthorized`, `404 Not Found`, `500 Internal Error`).

---

## 🏗️ Padrão Arquitetural (MVC)

O código backend foi estruturado seguindo o padrão de mercado **MVC (Model-View-Controller)** para garantir modularidade e separação limpa de responsabilidades:

```text
connecthub/
├── connecthub-backend/      # Camada de inteligência e persistência (API)
│   ├── src/
│   │   ├── config/          # Instanciação e conectores do banco de dados
│   │   ├── controllers/     # Regras de negócio e processamento de dados
│   │   ├── middlewares/     # Filtros de segurança e interceptadores de rotas
│   │   ├── models/          # Modelagem de esquemas e entidades do sistema
│   │   ├── routes/          # Mapeamento de endpoints HTTP/REST
│   │   └── server.js        # Arquivo de inicialização e inicializador global
│   └── package.json
└── connecthub-frontend/     # Camada visual do cliente (Interface)
    ├── index.html           # Estrutura e estilização responsiva da tela
    └── app.js               # Integração assíncrona via Fetch API com o servidor
```

---

## 🛠️ Tecnologias e Bibliotecas Utilizadas

- **Runtime:** Node.js
- **Framework Backend:** Express.js
- **Banco de Dados Relacional:** Banco local embutido para persistência estruturada por usuário
- **Segurança & Criptografia:** BcryptJS e JSON Web Token (JWT)
- **Comunicação de Rede:** CORS (Cross-Origin Resource Sharing)

---

## 🚀 Instruções de Instalação e Execução Local

### 1. Pré-requisitos

Certifique-se de possuir o **Node.js** instalado em seu computador antes de prosseguir.

### 2. Executando o Servidor (Backend)

No seu terminal do VS Code ou Prompt de Comando, acesse o diretório do backend e instale os pacotes necessários:

```bash
cd connecthub-backend
npm install
```

Para ligar a API diretamente pelo inicializador do Node.js, execute:

```bash
node src/server.js
```

O console exibirá as mensagens confirmando o sucesso da inicialização:

```text
Conectado com sucesso ao banco de dados permanente.
Servidor rodando com sucesso na porta 3000
```

### 3. Executando a Tela (Frontend)

Abra a pasta `connecthub-frontend` no seu gerenciador de arquivos e dê um duplo clique sobre o arquivo **`index.html`** para executá-lo diretamente no Google Chrome, Microsoft Edge ou navegador de sua preferência.

---

## 🛣️ Documentação de Endpoints da API RESTful

Todas as requisições privadas exigem o cabeçalho HTTP `Authorization: Bearer <seu_token_jwt>`.

| Tipo       | Endpoint             | Descrição                                | Acesso  | Corpo Esperado (JSON)                 |
| :--------- | :------------------- | :--------------------------------------- | :------ | :------------------------------------ |
| **POST**   | `/api/auth/register` | Cria uma nova conta no sistema           | Público | `{ "name", "email", "password" }`     |
| **POST**   | `/api/auth/login`    | Autentica e gera o token de acesso       | Público | `{ "email", "password" }`             |
| **POST**   | `/api/data`          | Salva um novo registro em nuvem          | Privado | `{ "title", "description", "value" }` |
| **GET**    | `/api/data`          | Lista os registros vinculados ao usuário | Privado | Nenhum                                |
| **DELETE** | `/api/data/:id`      | Remove permanentemente um dado           | Privado | Nenhum                                |
