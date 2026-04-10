const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ninhadaController = require('../controllers/ninhada.controller');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ninhada-' + uniqueSuffix + path.extname(file.originalname));
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

router.post('/', upload.single('imagem'), ninhadaController.criar);
router.get('/', ninhadaController.listar);
router.get('/:id', ninhadaController.obterPorId);
router.put('/:id', upload.single('imagem'), ninhadaController.atualizar);
router.delete('/:id', ninhadaController.deletar);

module.exports = router;