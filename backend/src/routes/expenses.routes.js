const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense.controller');

router.post('/', expenseController.createExpense);
router.get('/', expenseController.listExpenses);
router.delete('/:id', expenseController.deleteExpense);


module.exports = router;
