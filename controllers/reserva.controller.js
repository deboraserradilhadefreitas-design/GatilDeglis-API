const Reserva = require('../models/reserva.model');
const Gato = require('../models/gato.model');

// Criar uma nova reserva
exports.criar = async (req, res) => {
  try {
    const { gato_id, nome, email, telefone, observacoes } = req.body;

    // Validações básicas
    if (!gato_id || !nome || !email || !telefone) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Gato ID, nome, email e telefone são obrigatórios'
      });
    }

    // Verificar se o gato existe
    const gato = await Gato.findByPk(gato_id);
    if (!gato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Gato não encontrado'
      });
    }

    // Criar a reserva
    const reserva = await Reserva.create({
      gato_id,
      nome,
      email,
      telefone,
      observacoes: observacoes || null,
      status: 'pendente'
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Reserva criada com sucesso',
      dados: reserva
    });
  } catch (erro) {
    console.error('Erro ao criar reserva:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao criar reserva'
    });
  }
};

// Listar todas as reservas
exports.listar = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        {
          model: Gato,
          as: 'Gato',
          attributes: ['id', 'nome', 'raca', 'tipo', 'idade', 'sexo', 'coloracao', 'imagem']
        }
      ],
      order: [['data_solicitacao', 'DESC']]
    });

    res.status(200).json({
      sucesso: true,
      dados: reservas
    });
  } catch (erro) {
    console.error('Erro ao listar reservas:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao listar reservas'
    });
  }
};

// Listar reservas de um gato específico
exports.listarPorGato = async (req, res) => {
  try {
    const { gatoId } = req.params;

    const reservas = await Reserva.findAll({
      where: { gato_id: gatoId },
      order: [['data_solicitacao', 'DESC']]
    });

    res.status(200).json({
      sucesso: true,
      dados: reservas
    });
  } catch (erro) {
    console.error('Erro ao listar reservas do gato:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao listar reservas'
    });
  }
};

// Obter uma reserva específica
exports.obterPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [
        {
          model: Gato,
          as: 'Gato',
          attributes: ['id', 'nome', 'raca', 'tipo', 'idade', 'sexo', 'coloracao', 'imagem']
        }
      ]
    });

    if (!reserva) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Reserva não encontrada'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: reserva
    });
  } catch (erro) {
    console.error('Erro ao obter reserva:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao obter reserva'
    });
  }
};

// Atualizar status de uma reserva
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendente', 'confirmada', 'cancelada'].includes(status)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Status inválido. Use: pendente, confirmada ou cancelada'
      });
    }

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Reserva não encontrada'
      });
    }

    await reserva.update({ status });

    res.status(200).json({
      sucesso: true,
      mensagem: 'Reserva atualizada com sucesso',
      dados: reserva
    });
  } catch (erro) {
    console.error('Erro ao atualizar reserva:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao atualizar reserva'
    });
  }
};

// Deletar uma reserva
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Reserva não encontrada'
      });
    }

    await reserva.destroy();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Reserva deletada com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao deletar reserva:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao deletar reserva'
    });
  }
};
