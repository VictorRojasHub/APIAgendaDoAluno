const express = require('express');
const router = express.Router();
const { Falta, Aluno } = require('../models');

// Professor POST - registrar falta
router.post('/', async (req, res) => {
  const { alunoId, turmaId, data, motivo } = req.body;

  try {
    const falta = await Falta.create({ alunoId, turmaId, data, motivo });
    res.status(201).json(falta);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Aluno GET - ver faltas no mês
router.get('/aluno/:id', async (req, res) => {
  const alunoId = req.params.id;
  const { mes, ano } = req.query;

  const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const fim = `${ano}-${String(mes).padStart(2, '0')}-31`;

  try {
    const faltas = await Falta.findAll({
      where: {
        alunoId,
        data: {
          [require('sequelize').Op.between]: [inicio, fim]
        }
      }
    });
    res.json(faltas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
