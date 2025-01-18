export const selectExpenses = (state) => state.expenses.data;
export const selectTotalCount = (state) => state.expenses.totalCount;
export const selectCurrentExpense = (state) => state.expenses.current;
export const selectIsLoading = (state) => state.expenses.isLoading;
export const selectError = (state) => state.expenses.error;
