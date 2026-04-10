const Ninhada = require('../models/ninhada.model');
const fs = require('fs');
const path = require('path');

exports.criar = async (req, res) => {
  try {
    const { nome, pai_id, mae_id, quantidade_filhotes } = req.body;
    
    const dadosNinhada = {
      nome,
      pai_id,
      mae_id,
      quantidade_filhotes
    };

    // Se houver arquivo enviado, salvar o caminho
    if (req.file) {
      dadosNinhada.imagem = `/uploads/${req.file.filename}`;
    }

    const ninhada = await Ninhada.create(dadosNinhada);
    const ninhadaData = ninhada.toJSON();
    
    if (ninhadaData.imagem && !ninhadaData.imagem.startsWith('http')) {
      ninhadaData.imagem = `http://localhost:3000${ninhadaData.imagem}`;
    }
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Ninhada cadastrada com sucesso!',
      dados: ninhadaData
    });
  } catch (error) {
    // Se houver erro, deletar a imagem que foi uploaded
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo:', errDelete);
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const ninhadas = await Ninhada.findAll();
    
    // Garantir que o caminho da imagem está correto
    const ninhadasComImagem = ninhadas.map(ninhada => {
      const ninhadaData = ninhada.toJSON();
      if (ninhadaData.imagem && !ninhadaData.imagem.startsWith('http')) {
        ninhadaData.imagem = `http://localhost:3000${ninhadaData.imagem}`;
      }
      return ninhadaData;
    });
    
    res.json(ninhadasComImagem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ninhada = await Ninhada.findByPk(id);
    if (!ninhada) return res.status(404).json({ error: 'Ninhada não encontrada' });
    
    const ninhadaData = ninhada.toJSON();
    if (ninhadaData.imagem && !ninhadaData.imagem.startsWith('http')) {
      ninhadaData.imagem = `http://localhost:3000${ninhadaData.imagem}`;
    }
    
    res.json(ninhadaData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, pai_id, mae_id, quantidade_filhotes } = req.body;
    
    const ninhada = await Ninhada.findByPk(id);
    if (!ninhada) return res.status(404).json({ error: 'Ninhada não encontrada' });

    const dadosAtualizacao = {
      nome: nome || ninhada.nome,
      pai_id: pai_id || ninhada.pai_id,
      mae_id: mae_id || ninhada.mae_id,
      quantidade_filhotes: quantidade_filhotes || ninhada.quantidade_filhotes
    };

    // Se houver nova imagem, deletar a antiga e salvar a nova
    if (req.file) {
      if (ninhada.imagem) {
        const caminhoAntigo = path.join('uploads', path.basename(ninhada.imagem));
        fs.unlink(caminhoAntigo, (err) => {
          if (err) console.error('Erro ao deletar imagem antiga:', err);
        });
      }
      dadosAtualizacao.imagem = `/uploads/${req.file.filename}`;
    }

    await ninhada.update(dadosAtualizacao);
    const ninhadaData = ninhada.toJSON();
    
    if (ninhadaData.imagem && !ninhadaData.imagem.startsWith('http')) {
      ninhadaData.imagem = `http://localhost:3000${ninhadaData.imagem}`;
    }
    
    res.json({ 
      sucesso: true,
      mensagem: 'Ninhada atualizada com sucesso!',
      dados: ninhadaData
    });
  } catch (error) {
    // Se houver erro, deletar a imagem que foi uploaded
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (errDelete) => {
        if (errDelete) console.error('Erro ao deletar arquivo:', errDelete);
      });
    }
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