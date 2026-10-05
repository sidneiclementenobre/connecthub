const Datastore = require("nedb-promises");
const path = require("path");

// Cria arquivos separados para simular as tabelas do banco relacional permanentemente
const usersDb = Datastore.create({
  filename: path.resolve(__dirname, "../../users.db"),
  autoload: true,
});
const itemsDb = Datastore.create({
  filename: path.resolve(__dirname, "../../items.db"),
  autoload: true,
});

console.log("Conectado com sucesso ao banco de dados permanente.");

module.exports = { usersDb, itemsDb };
