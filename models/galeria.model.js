const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Galeria = sequelize.define('Galeria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  legenda: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'galerias',
  timestamps: true
});

module.exports = Galeria;
