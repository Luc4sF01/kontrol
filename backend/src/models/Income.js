const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  valor: {
    type: Number,
    required: true
  },
  mes: {
    type: Number,
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Income', IncomeSchema);
