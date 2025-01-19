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

expensesRouter.use(authHandler);

expensesRouter
  .route('/')
  .get(paginateElements, getAllExpenses)
  .post(validateExpense, createExpense);

expensesRouter
  .route('/:expenseUuid')
  .get(getExpenseByUuid)
  .patch(validateExpense, updateExpense)
  .delete(deleteExpense);

module.exports = expensesRouter;
