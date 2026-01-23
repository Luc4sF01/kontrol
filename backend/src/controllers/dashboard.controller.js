const Expense = require('../models/Expense');
const Income = require('../models/Income');

exports.getDashboard = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const income = await Income.findOne().sort({ createdAt: -1 });

    const totalGasto = expenses.reduce(
      (sum, expense) => sum + expense.valor,
      0
    );

    const porCategoria = {};
    expenses.forEach(expense => {
      if (!porCategoria[expense.categoria]) {
        porCategoria[expense.categoria] = 0;
      }
      porCategoria[expense.categoria] += expense.valor;
    });

    const renda = income ? income.valor : 0;
    const saldo = renda - totalGasto;

    return res.json({
      renda,
      totalGasto,
      saldo,
      porCategoria
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao gerar dashboard',
      error: error.message
    });
  }
};
