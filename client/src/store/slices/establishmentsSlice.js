import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import {
  setErrorActionState,
  setErrorListState,
  setLoadingActionState,
  setLoadingListState,
} from '../../utils/sharedFunctions';

import {
  addEstablishment,
  changeLogo,
  editEstablishment,
  fetchEstablishmentByUuid,
  fetchEstablishments,
  removeEstablishment,
  resetLogo,
} from '../thunks/establishmentsThunks';

const { ESTABLISHMENTS_SLICE_NAME } = sliceNames;

const initialState = {
  list: [],
  totalCount: 0,
  isLoadingList: false,
  listLoadingError: null,
  selected: null,
  isProcessingAction: true,
  actionError: null,
};

const establishmentsSlice = createSlice({
  name: ESTABLISHMENTS_SLICE_NAME,
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
      .addCase(fetchEstablishments.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.listLoadingError = null;
        state.list = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchEstablishmentByUuid.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.selected = payload;
      })
      .addCase(addEstablishment.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list.push(payload);
      })
      .addCase(editEstablishment.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (establishment) => establishment.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index] = payload;
        }
      })
      .addCase(changeLogo.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (establishment) => establishment.uuid === payload.uuid
        );
        if (index !== -1) {
          state.list[index].logo = payload.logo;
        }
      })
      .addCase(resetLogo.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        const index = state.list.findIndex(
          (establishment) => establishment.uuid === payload
        );
        if (index !== -1) {
          state.list[index].logo = null;
        }
      })
      .addCase(removeEstablishment.fulfilled, (state, { payload }) => {
        state.isProcessingAction = false;
        state.actionError = null;
        state.list = state.list.filter(
          (establishment) => establishment.uuid !== payload
        );
      })

      // Pending
      .addCase(fetchEstablishments.pending, setLoadingListState)
      .addCase(fetchEstablishmentByUuid.pending, setLoadingActionState)
      .addCase(addEstablishment.pending, setLoadingActionState)
      .addCase(editEstablishment.pending, setLoadingActionState)
      .addCase(changeLogo.pending, setLoadingActionState)
      .addCase(resetLogo.pending, setLoadingActionState)
      .addCase(removeEstablishment.pending, setLoadingActionState)

      // Rejected
      .addCase(fetchEstablishments.rejected, setErrorListState)
      .addCase(fetchEstablishmentByUuid.rejected, setErrorActionState)
      .addCase(addEstablishment.rejected, setErrorActionState)
      .addCase(editEstablishment.rejected, setErrorActionState)
      .addCase(changeLogo.rejected, setErrorActionState)
      .addCase(resetLogo.rejected, setErrorActionState)
      .addCase(removeEstablishment.rejected, setErrorActionState);
  },
});

export const { clearSelected } = establishmentsSlice.actions;

export default establishmentsSlice.reducer;
