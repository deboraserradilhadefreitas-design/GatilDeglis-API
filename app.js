require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuario.routes');
const gatoRoutes = require('./routes/gato.routes');

// Garante que a pasta de uploads exista e evita falha no multer
const uploadsFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/gatos', gatoRoutes); 

// Middlewares de tratamento de erros (inclui multer e CORS, 500 e 400)
app.use((err, req, res, next) => {
  console.error('Erro global do servidor:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    sucesso: false,
    erro: err.message || 'Erro não tratado no servidor'
  });
});

// Sincronização com o banco e start
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco sincronizado!');
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err);
});