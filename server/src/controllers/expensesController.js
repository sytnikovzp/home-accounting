const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllExpenses,
  getExpenseByUuid,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../services/expensesService');
const { getCurrentUser } = require('../services/usersService');

class ExpensesController {
  static async getAllExpenses(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { sort = 'uuid', order = 'asc', ago = 'allTime' },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const { allExpenses, totalCount, totalSumForPeriod } =
        await getAllExpenses(currentUser, ago, limit, offset, sort, order);
      if (allExpenses.length > 0) {
        res
          .status(200)
          .set('X-Total-Count', totalCount)
          .set('X-Total-Sum', totalSumForPeriod)
          .json(allExpenses);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all expenses error: ', error.message);
      next(error);
    }
  }

  static async getExpenseByUuid(req, res, next) {
    try {
      const {
        params: { expenseUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const expense = await getExpenseByUuid(expenseUuid, currentUser);
      if (expense) {
        res.status(200).json(expense);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get expense by UUID error: ', error.message);
      next(error);
    }
  }

  static async createExpense(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: {
          product,
          quantity,
          unitPrice,
          establishment,
          measure,
          currency,
          date,
        },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const newExpense = await createExpense(
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date,
        currentUser,
        transaction
      );
      if (newExpense) {
        await transaction.commit();
        res.status(201).json(newExpense);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Create expense error: ', error.message);
      next(error);
    }
  }

  static async updateExpense(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { expenseUuid },
        body: {
          product,
          quantity,
          unitPrice,
          establishment,
          measure,
          currency,
          date,
        },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const updatedExpense = await updateExpense(
        expenseUuid,
        product,
        quantity,
        unitPrice,
        establishment,
        measure,
        currency,
        date,
        currentUser,
        transaction
      );
      if (updatedExpense) {
        await transaction.commit();
        res.status(200).json(updatedExpense);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update expense error: ', error.message);
      next(error);
    }
  }

  static async deleteExpense(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { expenseUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const deletedExpense = await deleteExpense(
        expenseUuid,
        currentUser,
        transaction
      );
      if (deletedExpense) {
        await transaction.commit();
        res.status(200).json('OK');
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete expense error: ', error.message);
      next(error);
    }
  }
}

module.exports = ExpensesController;
