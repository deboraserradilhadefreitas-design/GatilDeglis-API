require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuario.routes');

app.use(express.json());

// Rotas
app.use('/usuarios', usuarioRoutes); 

// Sincronização com o banco e start
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco sincronizado!');
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err);
});