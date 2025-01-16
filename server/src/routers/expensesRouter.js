const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateExpense },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllExpenses,
  getExpenseByUuid,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expensesController');

const expensesRouter = new Router();

expensesRouter
  .route('/')
  .get(authHandler, paginateElements, getAllExpenses)
  .post(authHandler, validateExpense, createExpense);

expensesRouter
  .route('/:expenseUuid')
  .get(authHandler, getExpenseByUuid)
  .patch(authHandler, validateExpense, updateExpense)
  .delete(authHandler, deleteExpense);

module.exports = expensesRouter;
