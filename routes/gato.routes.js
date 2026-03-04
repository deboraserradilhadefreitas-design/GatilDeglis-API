const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const gatoController = require('../controllers/gato.controller');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gato-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Verificar se é uma imagem
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

router.post('/', upload.single('imagem'), gatoController.criar);
router.get('/', gatoController.listar);
router.get('/:id', gatoController.obterPorId);
router.put('/:id', upload.single('imagem'), gatoController.atualizar);
router.delete('/:id', gatoController.deletar);

module.exports = router;
