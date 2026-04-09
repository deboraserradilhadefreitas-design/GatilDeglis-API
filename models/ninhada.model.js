const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ninhada = sequelize.define('Ninhada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pai_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gatos',
      key: 'id'
    }
  },
  mae_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gatos',
      key: 'id'
    }
  },
  quantidade_filhotes: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ninhadas',
  timestamps: false
});

module.exports = Ninhada;