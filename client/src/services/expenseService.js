import api from '../api';

const getAllExpenses = async ({
  ago = 'allTime',
  page = 1,
  limit = 6,
  sort = 'uuid',
  order = 'asc',
} = {}) => {
  const params = new URLSearchParams({
    ago,
    page,
    limit,
    sort,
    order,
  }).toString();
  try {
    const { data, headers } = await api.get(`/expenses?${params}`);
    const totalCount = parseInt(headers['x-total-count']);
    return {
      data,
      totalCount,
    };
  } catch (error) {
    console.error(error.response.data.errors[0].title);
    return {
      data: [],
      totalCount: 0,
    };
  }
};

const getExpenseByUuid = async (expenseUuid) => {
  const { data } = await api.get(`/expenses/${expenseUuid}`);
  return data;
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
  const { data } = await api.post('/expenses', {
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date,
  });
  return data;
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
  const { data } = await api.patch(`/expenses/${expenseUuid}`, {
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date,
  });
  return data;
};

const deleteExpense = async (expenseUuid) => {
  const { data } = await api.delete(`/expenses/${expenseUuid}`);
  return data;
};

export default {
  getAllExpenses,
  getExpenseByUuid,
  createExpense,
  updateExpense,
  deleteExpense,
};
