const Gato = require('../models/gato.model');
const fs = require('fs');
const path = require('path');

exports.criar = async (req, res) => {
  try {
    const dadosGato = {
      nome: req.body.nome,
      raca: req.body.raca,
      sexo: req.body.sexo,
      coloracao: req.body.coloracao,
      observacoes: req.body.observacoes
    };

    // Se houver arquivo enviado, salvar o caminho
    if (req.file) {
      dadosGato.imagem = `/uploads/${req.file.filename}`;
    }

    const gato = await Gato.create(dadosGato);
    const gatoData = gato.toJSON();
    
    if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
      gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
    }
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Gato cadastrado com sucesso!',
      dados: gatoData
    });
  } catch (err) {
    // Se houver erro, deletar a imagem que foi uploaded
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo:', errDelete);
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
    const gatos = await Gato.findAll();
    
    // Garantir que o caminho da imagem está correto
    const gatosComImagem = gatos.map(gato => {
      const gatoData = gato.toJSON();
      // Se a imagem não começa com http, é um caminho relativo
      if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
        gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
      }
      return gatoData;
    });

    res.json({
      sucesso: true,
      dados: gatosComImagem
    });
  } catch (err) {
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const gato = await Gato.findByPk(req.params.id);
    if (!gato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Gato não encontrado'
      });
    }
    
    const gatoData = gato.toJSON();
    if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
      gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
    }
    
    res.json({
      sucesso: true,
      dados: gatoData
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
    const gato = await Gato.findByPk(req.params.id);
    if (!gato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Gato não encontrado'
      });
    }

    const dadosAtualizacao = {
      nome: req.body.nome || gato.nome,
      raca: req.body.raca || gato.raca,
      sexo: req.body.sexo || gato.sexo,
      coloracao: req.body.coloracao || gato.coloracao,
      observacoes: req.body.observacoes || gato.observacoes
    };

    // Se houver nova imagem, deletar a antiga e salvar a nova
    if (req.file) {
      if (gato.imagem) {
        const caminhoAntigo = path.join('uploads', path.basename(gato.imagem));
        fs.unlink(caminhoAntigo, (err) => {
          if (err) console.error('Erro ao deletar imagem antiga:', err);
        });
      }
      dadosAtualizacao.imagem = `/uploads/${req.file.filename}`;
    }

    await gato.update(dadosAtualizacao);
    const gatoData = gato.toJSON();
    
    if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
      gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
    }
    
    res.json({
      sucesso: true,
      mensagem: 'Gato atualizado com sucesso!',
      dados: gatoData
    });
  } catch (err) {
    // Se houver erro, deletar a imagem que foi uploaded
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo:', errDelete);
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
    const gato = await Gato.findByPk(req.params.id);
    if (!gato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Gato não encontrado'
      });
    }

    // Deletar a imagem associada ao gato
    if (gato.imagem) {
      const caminhoImagem = path.join('uploads', path.basename(gato.imagem));
      fs.unlink(caminhoImagem, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }

    await gato.destroy();
    res.json({
      sucesso: true,
      mensagem: 'Gato deletado com sucesso!'
    });
  } catch (err) {
    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
};
