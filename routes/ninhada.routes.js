const express = require('express');
const router = express.Router();
const ninhadaController = require('../controllers/ninhada.controller');

router.post('/', ninhadaController.criar);
router.get('/', ninhadaController.listar);
router.get('/:id', ninhadaController.obterPorId);
router.put('/:id', ninhadaController.atualizar);
router.delete('/:id', ninhadaController.deletar);

module.exports = router;