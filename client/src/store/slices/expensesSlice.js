import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

import {
  addExpense,
  editExpense,
  fetchExpenseByUuid,
  fetchExpenses,
  removeExpense,
} from '../thunks/expensesThunks';

const { EXPENSES_SLICE_NAME } = sliceNames;

const initialState = {
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const expensesSlice = createSlice({
  name: EXPENSES_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchExpenses.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchExpenseByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addExpense.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editExpense.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (expense) => expense.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(removeExpense.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter((expense) => expense.uuid !== payload);
      })

      // Pending
      .addCase(fetchExpenses.pending, setLoadingState)
      .addCase(fetchExpenseByUuid.pending, setLoadingState)
      .addCase(addExpense.pending, setLoadingState)
      .addCase(editExpense.pending, setLoadingState)
      .addCase(removeExpense.pending, setLoadingState)

      // Rejected
      .addCase(fetchExpenses.rejected, setErrorState)
      .addCase(fetchExpenseByUuid.rejected, setErrorState)
      .addCase(addExpense.rejected, setErrorState)
      .addCase(editExpense.rejected, setErrorState)
      .addCase(removeExpense.rejected, setErrorState);
  },
});

export const { clearCurrent } = expensesSlice.actions;

export default expensesSlice.reducer;
