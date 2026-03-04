require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuario.routes');
const gatoRoutes = require('./routes/gato.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/gatos', gatoRoutes); 

// Sincronização com o banco e start
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco sincronizado!');
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err);
});