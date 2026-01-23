const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');

router.get('/', incomeController.getIncomes);
router.post('/', incomeController.createIncome);
router.put('/:id', incomeController.updateIncome);    // Nova
router.delete('/:id', incomeController.deleteIncome); // Nova

module.exports = router;