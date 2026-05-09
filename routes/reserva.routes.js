const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// POST - Criar uma nova reserva
router.post('/', reservaController.criar);

// GET - Listar todas as reservas
router.get('/', reservaController.listar);

// GET - Listar reservas de um gato específico
router.get('/gato/:gatoId', reservaController.listarPorGato);

// GET - Obter uma reserva específica
router.get('/:id', reservaController.obterPorId);

// PUT - Atualizar status de uma reserva
router.put('/:id/status', reservaController.atualizarStatus);

// DELETE - Deletar uma reserva
router.delete('/:id', reservaController.deletar);

module.exports = router;
