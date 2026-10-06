require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // Importação necessária para manipular caminhos de arquivos
const initDatabase = require("./models/schema");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializa o banco de dados
initDatabase();

// --- NOVIDADE: Servir os arquivos visuais do Frontend automaticamente ---
// Avisa ao Express para disponibilizar os arquivos da pasta do frontend publicamente
app.use(express.static(path.join(__dirname, "../connecthub-frontend")));

// Vincula todas as rotas de API do backend
app.use("/api", apiRoutes);

// --- NOVIDade: Rota principal que abre o index.html ---
// Quando o usuário acessar a URL base do seu Render, ele abrirá a tela do ConnectHub
app.get("/:any*", (req, res) => {
  res.sendFile(path.join(__dirname, "../connecthub-frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
