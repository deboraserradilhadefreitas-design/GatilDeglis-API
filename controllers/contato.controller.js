const Contato = require('../models/contato.model');

// Criar um novo contato
exports.criar = async (req, res) => {
  try {
    const { raca, nome, email, telefone, cidade, mensagem } = req.body;

    // Validações básicas
    if (!raca || !nome || !email || !telefone || !cidade || !mensagem) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Raça, nome, email, telefone, cidade e mensagem são obrigatórios'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Email inválido'
      });
    }

    // Validar telefone (10 ou 11 dígitos)
    const telefoneRegex = /^\d{10,11}$/;
    if (!telefoneRegex.test(telefone.replace(/\D/g, ''))) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Telefone inválido. Use 10 ou 11 dígitos'
      });
    }

    // Obter IP de origem
    const ipOrigem = req.ip || req.connection.remoteAddress;

    // Criar o contato
    const contato = await Contato.create({
      raca,
      nome,
      email,
      telefone: telefone.replace(/\D/g, ''),
      cidade,
      mensagem,
      status: 'nao_lido',
      ip_origem: ipOrigem
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Contato recebido com sucesso',
      dados: contato
    });
  } catch (erro) {
    console.error('Erro ao criar contato:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao criar contato'
    });
  }
};

// Listar todos os contatos (com filtros opcionais)
exports.listar = async (req, res) => {
  try {
    const { status, ordenar } = req.query;
    const where = {};
    const order = [];

    // Filtro por status
    if (status && (status === 'lido' || status === 'nao_lido')) {
      where.status = status;
    }

    // Ordenação
    if (ordenar === 'data_asc') {
      order.push(['data_envio', 'ASC']);
    } else {
      order.push(['data_envio', 'DESC']); // padrão: mais recentes primeiro
    }

    const contatos = await Contato.findAll({
      where,
      order: order.length > 0 ? order : [['data_envio', 'DESC']]
    });

    const total = contatos.length;
    const naoLidos = contatos.filter(c => c.status === 'nao_lido').length;

    res.status(200).json({
      sucesso: true,
      dados: contatos,
      contadores: {
        total,
        naoLidos
      }
    });
  } catch (erro) {
    console.error('Erro ao listar contatos:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao listar contatos'
    });
  }
};

// Obter um contato específico
exports.obterPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const contato = await Contato.findByPk(id);
    if (!contato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Contato não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: contato
    });
  } catch (erro) {
    console.error('Erro ao obter contato:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao obter contato'
    });
  }
};

// Atualizar status de um contato
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status
    if (!status || (status !== 'lido' && status !== 'nao_lido')) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Status inválido. Use "lido" ou "nao_lido"'
      });
    }

    const contato = await Contato.findByPk(id);
    if (!contato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Contato não encontrado'
      });
    }

    contato.status = status;
    await contato.save();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Status atualizado com sucesso',
      dados: contato
    });
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao atualizar status'
    });
  }
};

// Deletar um contato
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const contato = await Contato.findByPk(id);
    if (!contato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Contato não encontrado'
      });
    }

    await contato.destroy();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Contato deletado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao deletar contato:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao deletar contato'
    });
  }
};

// Obter contadores
exports.obterContadores = async (req, res) => {
  try {
    const total = await Contato.count();
    const naoLidos = await Contato.count({
      where: { status: 'nao_lido' }
    });
    const lidos = await Contato.count({
      where: { status: 'lido' }
    });

    res.status(200).json({
      sucesso: true,
      contadores: {
        total,
        naoLidos,
        lidos
      }
    });
  } catch (erro) {
    console.error('Erro ao obter contadores:', erro);
    res.status(500).json({
      sucesso: false,
      erro: erro.message || 'Erro ao obter contadores'
    });
  }
};
