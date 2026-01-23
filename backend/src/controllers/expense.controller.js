const Expense = require('../models/Expense');

const CATEGORIAS_VALIDAS = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Outros'
];

exports.createExpense = async (req, res) => {
  try {
    const { valor, categoria, descricao } = req.body;

    // validações
    if (valor === undefined || valor <= 0) {
      return res.status(400).json({
        message: 'Valor é obrigatório e deve ser maior que zero'
      });
    }

    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({
        message: 'Categoria inválida'
      });
    }

    const expense = await Expense.create({
      valor,
      categoria,
      descricao
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar gasto',
      error: error.message
    });
  }
};


exports.listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar gastos', error });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await Expense.findByIdAndDelete(id);

    return res.json({ message: 'Gasto removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover gasto', error });
  }
};
