import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addExpense,
  editExpense,
  fetchExpenseByUuid,
  fetchExpenses,
  removeExpense,
} from '../thunks/expensesThunks';

const { EXPENSES_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const expensesSlice = createSlice({
  name: EXPENSES_SLICE_NAME,
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchExpenses.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchExpenseByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addExpense.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editExpense.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (expense) => expense.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(removeExpense.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter((expense) => expense.uuid !== payload);
      })

      // Pending
      .addCase(fetchExpenses.pending, setLoadingListState)
      .addCase(fetchExpenseByUuid.pending, setLoadingActionState)
      .addCase(addExpense.pending, setLoadingActionState)
      .addCase(editExpense.pending, setLoadingActionState)
      .addCase(removeExpense.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchExpenses.rejected, setErrorListState)
      .addCase(fetchExpenseByUuid.rejected, setErrorActionState)
      .addCase(addExpense.rejected, setErrorActionState)
      .addCase(editExpense.rejected, setErrorActionState)
      .addCase(removeExpense.rejected, setErrorActionState);
  },
});

export const { clearSelected } = expensesSlice.actions;

export default expensesSlice.reducer;
