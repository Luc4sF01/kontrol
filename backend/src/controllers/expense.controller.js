const Expense = require('../models/Expense');

const CATEGORIAS_VALIDAS = [
  'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Outros'
];

exports.createExpense = async (req, res) => {
  try {
    // --- CORREÇÃO AQUI: Lendo o createdAt do corpo da requisição ---
    const { valor, categoria, descricao, createdAt } = req.body;

    // validações
    if (valor === undefined || valor <= 0) {
      return res.status(400).json({
        message: 'Valor é obrigatório e deve ser maior que zero'
      });
    }

    // Se categoria vier vazia ou inválida, joga para Outros (opcional, mas evita erros)
    const categoriaFinal = CATEGORIAS_VALIDAS.includes(categoria) ? categoria : 'Outros';

    const expense = await Expense.create({
      valor,
      categoria: categoriaFinal,
      descricao,
      // --- CORREÇÃO AQUI: Usa a data do front ou a data de agora ---
      createdAt: createdAt ? new Date(createdAt) : new Date()
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

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, categoria, descricao } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      id,
      { valor, categoria, descricao },
      { new: true } 
    );

    return res.json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar', error });
  }
};