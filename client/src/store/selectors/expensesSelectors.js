export const selectExpenses = (state) => state.expenses.data;
export const selectTotalCount = (state) => state.expenses.totalCount;
export const selectCurrentExpense = (state) => state.expenses.current;
export const selectExpensesIsLoading = (state) => state.expenses.isLoading;
export const selectExpensesError = (state) => state.expenses.error;
