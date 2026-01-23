const Income = require('../models/Income');

// Listar todas
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    return res.json(incomes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar rendas', error });
  }
};

// Criar (Agora permite múltiplas rendas no mesmo mês)
exports.createIncome = async (req, res) => {
  try {
    const { valor, mes, ano, descricao } = req.body; // Adicionei descrição opcional

    if (!valor || valor <= 0) return res.status(400).json({ message: 'Valor inválido' });
    if (!mes || !ano) return res.status(400).json({ message: 'Data inválida' });

    // REMOVI A LINHA QUE DELETAVA A RENDA ANTERIOR (findOneAndDelete)
    
    const income = await Income.create({
      valor,
      mes,
      ano,
      descricao: descricao || 'Entrada' // Se não vier descrição, usa "Entrada"
    });

    return res.status(201).json(income);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar renda', error: error.message });
  }
};

// Atualizar (PUT)
exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, descricao } = req.body;

    const income = await Income.findByIdAndUpdate(
      id,
      { valor, descricao },
      { new: true }
    );
    return res.json(income);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar', error });
  }
};

// Deletar (DELETE)
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    return res.json({ message: 'Renda removida' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover', error });
  }
};