const { itemsDb } = require("../config/database");

exports.create = async (req, res) => {
  const { title, description, value } = req.body;
  if (!title) return res.status(400).json({ error: "O título é obrigatório." });

  try {
    const newItem = await itemsDb.insert({
      title,
      description,
      value,
      user_id: req.userId,
    });
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar registro." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const rows = await itemsDb.find({ user_id: req.userId });
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar registros." });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, description, value } = req.body;

  try {
    const numUpdated = await itemsDb.update(
      { _id: id, user_id: req.userId },
      { $set: { title, description, value } }
    );
    if (numUpdated === 0)
      return res
        .status(404)
        .json({ error: "Registro não encontrado ou não autorizado." });
    return res.json({ message: "Registro atualizado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const numDeleted = await itemsDb.remove({ _id: id, user_id: req.userId });
    if (numDeleted === 0)
      return res
        .status(404)
        .json({ error: "Registro não encontrado ou não autorizado." });
    return res.json({ message: "Registro excluído com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir registro." });
  }
};
