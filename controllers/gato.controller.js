const Gato = require('../models/gato.model');
const Reserva = require('../models/reserva.model');
const fs = require('fs');
const path = require('path');

exports.criar = async (req, res) => {
  try {
    console.log('=== CRIAR GATO ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file ? 'Arquivo enviado' : 'Sem arquivo');
    
    const dadosGato = {
      nome: req.body.nome,
      raca: req.body.raca,
      sexo: req.body.sexo,
      coloracao: req.body.coloracao,
      observacoes: req.body.observacoes || '',
      status: req.body.status || null,
      tipo: req.body.tipo || 'gato',
      idade: req.body.idade ? parseInt(req.body.idade) : null
    };

    console.log('Dados processados:', dadosGato);

    // Validação mínima de campos obrigatórios
    if (!dadosGato.nome || !dadosGato.raca || !dadosGato.sexo || !dadosGato.coloracao) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Os campos nome, raça, sexo e coloração são obrigatórios.'
      });
    }

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
    
    // Garantir que o caminho da imagem está correto e adicionar tipo padrão para dados legados
    const gatosComImagem = gatos.map(gato => {
      const gatoData = gato.toJSON();
      // Se a imagem não começa com http, é um caminho relativo
      if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
        gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
      }
      // Se não tiver tipo (dados legados), definir como 'gato' por padrão
      if (!gatoData.tipo) {
        gatoData.tipo = 'gato';
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

exports.listarReservados = async (req, res) => {
  try {
    const gatos = await Gato.findAll({
      include: [
        {
          model: Reserva,
          as: 'Reservas',
          required: true
        }
      ]
    });
    
    // Garantir que o caminho da imagem está correto e adicionar tipo padrão para dados legados
    const gatosComImagem = gatos.map(gato => {
      const gatoData = gato.toJSON();
      // Se a imagem não começa com http, é um caminho relativo
      if (gatoData.imagem && !gatoData.imagem.startsWith('http')) {
        gatoData.imagem = `http://localhost:3000${gatoData.imagem}`;
      }
      // Se não tiver tipo (dados legados), definir como 'gato' por padrão
      if (!gatoData.tipo) {
        gatoData.tipo = 'gato';
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
    // Se não tiver tipo (dados legados), definir como 'gato' por padrão
    if (!gatoData.tipo) {
      gatoData.tipo = 'gato';
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
    console.log('=== ATUALIZAR GATO ===');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);
    console.log('req.body.tipo:', req.body.tipo);
    
    const gato = await Gato.findByPk(req.params.id);
    if (!gato) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Gato não encontrado'
      });
    }

    //  return res.json({ debugTipo: req.body.tipo, body: req.body });


    const dadosAtualizacao = {
      nome: req.body.nome ? req.body.nome : gato.nome,
      raca: req.body.raca ? req.body.raca : gato.raca,
      sexo: req.body.sexo ? req.body.sexo : gato.sexo,
      coloracao: req.body.coloracao ? req.body.coloracao : gato.coloracao,
      observacoes: req.body.observacoes !== undefined ? req.body.observacoes : gato.observacoes,
      status: req.body.status !== undefined && req.body.status ? req.body.status : (req.body.status === '' ? null : gato.status),
      tipo: req.body.tipo ? req.body.tipo : gato.tipo,
      idade: req.body.idade ? parseInt(req.body.idade) : gato.idade
    };

    console.log('Dados finais para atualização:', dadosAtualizacao);

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
