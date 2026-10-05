require("dotenv").config();
const express = require("express");
const cors = require("cors");
const initDatabase = require("./models/schema");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS (Resolve o ponto crítico de conflito apontado no enunciado)
app.use(cors());
app.use(express.json());

// Inicializa as tabelas do banco SQL
initDatabase();

// Rota Base / Hello World (Marco 1)
app.get("/", (req, res) => {
  res.json({ message: "ConnectHub API está online e operando!" });
});

// Vincula todas as rotas estruturadas da API
app.use("/api", apiRoutes);

// Tratamento global para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
