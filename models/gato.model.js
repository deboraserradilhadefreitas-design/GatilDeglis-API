const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gato = sequelize.define('Gato', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.ENUM('Macho', 'Fêmea'),
    allowNull: false
  },
  coloracao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Disponível', 'Vendido', 'Reservado'),
    allowNull: false,
    defaultValue: 'Disponível'
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'gatos',
  timestamps: false
});

module.exports = Gato;
