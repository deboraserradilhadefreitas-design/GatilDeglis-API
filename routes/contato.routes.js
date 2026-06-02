const express = require('express');
const router = express.Router();
const contatoController = require('../controllers/contato.controller');

// POST - Criar um novo contato
router.post('/', contatoController.criar);

// GET - Listar todos os contatos (com filtros)
router.get('/', contatoController.listar);

// GET - Obter contadores
router.get('/contadores', contatoController.obterContadores);

// GET - Obter um contato específico
router.get('/:id', contatoController.obterPorId);

// PUT - Atualizar status de um contato
router.put('/:id/status', contatoController.atualizarStatus);

// DELETE - Deletar um contato
router.delete('/:id', contatoController.deletar);

module.exports = router;
