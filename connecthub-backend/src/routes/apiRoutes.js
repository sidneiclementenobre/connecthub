const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const dataController = require("../controllers/dataController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas Públicas (Autenticação)
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

// Rotas Privadas (CRUD protegido por Middleware JWT)
router.post("/data", authMiddleware, dataController.create);
router.get("/data", authMiddleware, dataController.getAll);
router.put("/data/:id", authMiddleware, dataController.update);
router.delete("/data/:id", authMiddleware, dataController.delete);

module.exports = router;
