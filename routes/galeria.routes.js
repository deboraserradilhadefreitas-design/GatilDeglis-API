const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const galeriaController = require('../controllers/galeria.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'galeria-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

router.post('/', upload.single('imagem'), galeriaController.criar);
router.get('/', galeriaController.listar);
router.put('/:id', upload.single('imagem'), galeriaController.atualizar);
router.delete('/:id', galeriaController.deletar);

module.exports = router;
