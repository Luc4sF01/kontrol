const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
