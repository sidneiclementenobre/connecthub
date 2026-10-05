const { usersDb } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cadastro de novos usuários
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const userExists = await usersDb.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "E-mail já cadastrado no sistema." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersDb.insert({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ id: newUser._id, name, email });
  } catch (error) {
    console.error("Erro no Registro:", error);
    return res.status(500).json({ error: "Erro interno ao salvar usuário." });
  }
};

// Login seguro de usuários existentes
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    const user = await usersDb.findOne({ email });

    // Se o usuário não existir no banco de dados, retorna erro 401 de forma segura
    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Validação da senha com hash seguro
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Geração do Token JWT (Expira em 2h)
    const token = jwt.sign(
      { id: user._id },
      "chave_secreta_reserva_para_residencia_2026",
      {
        expiresIn: "2h",
      }
    );

    return res.json({
      message: "Autenticação realizada com sucesso!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Erro no Login:", error);
    return res
      .status(500)
      .json({ error: "Erro no processamento interno do servidor." });
  }
};
