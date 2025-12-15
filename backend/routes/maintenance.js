const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

// LISTAR TODAS (GET) - Com Populate
router.get("/", async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('machine') 
      .populate('technical'); 
    res.json(maintenance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const nova = await Maintenance.create(req.body);
    const populada = await nova.populate(['machine', 'technical']);
    res.status(201).json(populada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const atualizada = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(['machine', 'technical']);
    
    if (!atualizada) return res.status(404).json({ mensagem: "Manutenção não encontrada" });
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deletada) return res.status(404).json({ mensagem: "Manutenção não encontrada" });
    res.json({ mensagem: "Manutenção deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;