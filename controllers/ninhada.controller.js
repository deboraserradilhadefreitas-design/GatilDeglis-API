const Ninhada = require('../models/ninhada.model');

exports.criar = async (req, res) => {
  try {
    const { nome, imagem, pai_id, mae_id, quantidade_filhotes } = req.body;
    const ninhada = await Ninhada.create({ nome, imagem, pai_id, mae_id, quantidade_filhotes });
    res.status(201).json(ninhada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const ninhadas = await Ninhada.findAll();
    res.json(ninhadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ninhada = await Ninhada.findByPk(id);
    if (!ninhada) return res.status(404).json({ error: 'Ninhada não encontrada' });
    res.json(ninhada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, imagem, pai_id, mae_id, quantidade_filhotes } = req.body;
    const [updated] = await Ninhada.update({ nome, imagem, pai_id, mae_id, quantidade_filhotes }, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Ninhada não encontrada' });
    res.json({ message: 'Ninhada atualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ninhada.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Ninhada não encontrada' });
    res.json({ message: 'Ninhada deletada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};