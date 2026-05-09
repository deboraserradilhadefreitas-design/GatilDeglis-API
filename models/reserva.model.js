const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gato_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Gatos',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  data_solicitacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

module.exports = Reserva;
