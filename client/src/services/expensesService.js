import { requestHandler } from '../utils/sharedFunctions';

const getAllExpenses = async ({
  ago = 'allTime',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = { ago, page, limit, sort, order };
  const response = await requestHandler({
    url: '/expenses',
    method: 'GET',
    params,
  });
  return response;
};

const getExpenseByUuid = async (expenseUuid) => {
  const response = await requestHandler({
    url: `/expenses/${expenseUuid}`,
    method: 'GET',
  });
  return response;
};

const createExpense = async (
  product,
  quantity,
  unitPrice,
  establishment,
  measure,
  currency,
  date
) => {
  const response = await requestHandler({
    url: '/expenses',
    method: 'POST',
    data: {
      product,
      quantity,
      unitPrice,
      establishment,
      measure,
      currency,
      date,
    },
  });
  return response;
};

const updateExpense = async (
  expenseUuid,
  product,
  quantity,
  unitPrice,
  establishment,
  measure,
  currency,
  date
) => {
  const response = await requestHandler({
    url: `/expenses/${expenseUuid}`,
    method: 'PATCH',
    data: {
      product,
      quantity,
      unitPrice,
      establishment,
      measure,
      currency,
      date,
    },
  });
  return response;
};

const deleteExpense = async (expenseUuid) => {
  const response = await requestHandler({
    url: `/expenses/${expenseUuid}`,
    method: 'DELETE',
  });
  return response;
};

export {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseByUuid,
  updateExpense,
};
