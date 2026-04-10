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
    allowNull: true,
    defaultValue: null
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data_nascimento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 30
    }
  },
  tipo: {
    type: DataTypes.ENUM('filhote', 'gato'),
    allowNull: false,
    defaultValue: 'gato'
  }
}, {
  tableName: 'gatos',
  timestamps: false
});

module.exports = Gato;
