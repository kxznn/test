const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");

// LISTAR TODAS (GET)
router.get("/", async (req, res) => {
  try {
    const Machines = await Machine.find();
    res.json(Machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRIAR (POST)
router.post("/", async (req, res) => {
  try {
    const nova = await Machine.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ATUALIZAR (PUT)
router.put("/:id", async (req, res) => {
  try {
    const update = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) return res.status(404).json({ mensagem: "Máquina não encontrada" });
    res.json(update);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETAR (delet)
router.delete("/:id", async (req, res) => {
  try {
    const deletado = await Machine.findByIdAnddelet(req.params.id);
    if (!deletado) return res.status(404).json({ mensagem: "Máquina não encontrada" });
    res.json({ mensagem: "Máquina deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;