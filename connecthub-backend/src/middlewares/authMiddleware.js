const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1]; // Pega o token após a palavra "Bearer"

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    // Usa a mesma chave direta para descriptografar e validar o token com sucesso
    const decoded = jwt.verify(
      token,
      "chave_secreta_reserva_para_residencia_2026"
    );
    req.userId = decoded.id; // Injeta o ID do usuário com segurança na requisição
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
