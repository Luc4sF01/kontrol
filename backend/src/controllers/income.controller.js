const Income = require('../models/Income');

exports.createIncome = async (req, res) => {
  try {
    const { valor, mes, ano } = req.body;

    if (valor === undefined || valor <= 0) {
      return res.status(400).json({
        message: 'Valor da renda deve ser maior que zero'
      });
    }

    if (mes < 1 || mes > 12) {
      return res.status(400).json({
        message: 'Mês inválido'
      });
    }

    if (!ano || ano < 2000) {
      return res.status(400).json({
        message: 'Ano inválido'
      });
    }

    await Income.findOneAndDelete({ mes, ano });

    const income = await Income.create({
      valor,
      mes,
      ano
    });

    return res.status(201).json(income);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao cadastrar renda',
      error: error.message
    });
  }
};
