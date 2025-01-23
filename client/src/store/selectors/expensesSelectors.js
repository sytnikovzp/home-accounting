export const selectExpenses = (state) => state.expenses.list;
export const selectTotalCount = (state) => state.expenses.totalCount;
export const selectSelectedExpense = (state) => state.expenses.selected;

export const selectExpensesIsLoadingList = (state) =>
  state.expenses.isLoadingList;
export const selectExpensesListLoadingError = (state) =>
  state.expenses.listLoadingError;

export const selectExpensesProcessingAction = (state) =>
  state.expenses.isProcessingAction;
export const selectExpensesActionError = (state) => state.expenses.actionError;
