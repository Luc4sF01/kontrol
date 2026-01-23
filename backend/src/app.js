const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
const expenseRoutes = require('./routes/expenses.routes');

app.use('/expenses', expenseRoutes);

const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/dashboard', dashboardRoutes);

const incomeRoutes = require('./routes/income.routes');
app.use('/income', incomeRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch(err => console.error('🔴 Erro ao conectar no MongoDB', err));


// Rota de teste
app.get('/', (req, res) => {
  return res.json({ message: 'Kontrol API is running 🚀' });
});



module.exports = app;
