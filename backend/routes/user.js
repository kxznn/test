const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const novo = await User.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const atualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ mensagem: "Técnico não encontrado" });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletado = await User.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ mensagem: "Técnico não encontrado" });
    res.json({ mensagem: "Técnico deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;