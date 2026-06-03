const Galeria = require('../models/galeria.model');
const fs = require('fs');
const path = require('path');

function montarUrlImagem(req, url) {
  if (!url) return url;
  if (url.startsWith('http')) {
    return url;
  }
  return `${req.protocol}://${req.get('host')}${url}`;
}

exports.criar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Uma imagem é obrigatória para cadastrar na galeria.'
      });
    }

    const dadosGaleria = {
      url: `/uploads/${req.file.filename}`,
      legenda: req.body.legenda || null
    };

    const registro = await Galeria.create(dadosGaleria);
    const registroData = registro.toJSON();
    registroData.url = montarUrlImagem(req, registroData.url);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Imagem adicionada à galeria com sucesso!',
      dados: registroData
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo após falha:', errDelete);
      });
    }
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};

exports.listar = async (req, res) => {
  try {
    const galeria = await Galeria.findAll({ order: [['createdAt', 'DESC']] });
    const dados = galeria.map(item => {
      const registroData = item.toJSON();
      registroData.url = montarUrlImagem(req, registroData.url);
      return registroData;
    });

    res.json({
      sucesso: true,
      dados
    });
  } catch (err) {
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const galeria = await Galeria.findByPk(req.params.id);
    if (!galeria) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Imagem da galeria não encontrada.'
      });
    }

    const dadosAtualizacao = {
      legenda: req.body.legenda !== undefined ? req.body.legenda : galeria.legenda
    };

    if (req.file) {
      if (galeria.url) {
        const caminhoAntigo = path.join('uploads', path.basename(galeria.url));
        fs.unlink(caminhoAntigo, (err) => {
          if (err) console.error('Erro ao deletar imagem antiga da galeria:', err);
        });
      }
      dadosAtualizacao.url = `/uploads/${req.file.filename}`;
    }

    await galeria.update(dadosAtualizacao);
    const registroData = galeria.toJSON();
    registroData.url = montarUrlImagem(req, registroData.url);

    res.json({
      sucesso: true,
      mensagem: 'Legenda atualizada com sucesso!',
      dados: registroData
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo após falha:', errDelete);
      });
    }
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};

exports.deletar = async (req, res) => {
  try {
    const galeria = await Galeria.findByPk(req.params.id);
    if (!galeria) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Imagem da galeria não encontrada.'
      });
    }

    if (galeria.url) {
      const caminhoImagem = path.join('uploads', path.basename(galeria.url));
      fs.unlink(caminhoImagem, (err) => {
        if (err) console.error('Erro ao deletar imagem da galeria:', err);
      });
    }

    await galeria.destroy();
    res.json({
      sucesso: true,
      mensagem: 'Imagem da galeria removida com sucesso!'
    });
  } catch (err) {
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};
