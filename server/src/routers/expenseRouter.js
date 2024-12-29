const { Router } = require('express');
// ==============================================================
const {
  getAllExpenses,
  getExpenseByUuid,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const {
  auth: { authHandler },
  validation: { validateExpense },
  pagination: { paginateElements },
} = require('../middlewares');

const expenseRouter = new Router();

expenseRouter
  .route('/')
  .get(authHandler, paginateElements, getAllExpenses)
  .post(authHandler, validateExpense, createExpense);

expenseRouter
  .route('/:expenseUuid')
  .get(authHandler, getExpenseByUuid)
  .patch(authHandler, validateExpense, updateExpense)
  .delete(authHandler, deleteExpense);

module.exports = expenseRouter;
