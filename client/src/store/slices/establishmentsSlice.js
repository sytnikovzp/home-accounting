import { createSlice } from '@reduxjs/toolkit';

import { sliceNames } from '../../constants';
import { setErrorState, setLoadingState } from '../../utils/sharedFunctions';

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
  data: [],
  totalCount: 0,
  current: null,
  isLoading: false,
  error: null,
};

const establishmentsSlice = createSlice({
  name: ESTABLISHMENTS_SLICE_NAME,
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled
      .addCase(fetchEstablishments.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = payload.data;
        state.totalCount = payload.totalCount;
      })
      .addCase(fetchEstablishmentByUuid.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.current = payload;
      })
      .addCase(addEstablishment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data.push(payload);
      })
      .addCase(editEstablishment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (establishment) => establishment.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(changeLogo.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (establishment) => establishment.uuid === payload.uuid
        );
        if (index !== -1) {
          state.data[index].logo = payload.logo;
        }
      })
      .addCase(resetLogo.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        const index = state.data.findIndex(
          (establishment) => establishment.uuid === payload
        );
        if (index !== -1) {
          state.data[index].logo = null;
        }
      })
      .addCase(removeEstablishment.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.data = state.data.filter(
          (establishment) => establishment.uuid !== payload
        );
      })

      // Pending
      .addCase(fetchEstablishments.pending, setLoadingState)
      .addCase(fetchEstablishmentByUuid.pending, setLoadingState)
      .addCase(addEstablishment.pending, setLoadingState)
      .addCase(editEstablishment.pending, setLoadingState)
      .addCase(changeLogo.pending, setLoadingState)
      .addCase(resetLogo.pending, setLoadingState)
      .addCase(removeEstablishment.pending, setLoadingState)

      // Rejected
      .addCase(fetchEstablishments.rejected, setErrorState)
      .addCase(fetchEstablishmentByUuid.rejected, setErrorState)
      .addCase(addEstablishment.rejected, setErrorState)
      .addCase(editEstablishment.rejected, setErrorState)
      .addCase(changeLogo.rejected, setErrorState)
      .addCase(resetLogo.rejected, setErrorState)
      .addCase(removeEstablishment.rejected, setErrorState);
  },
});

export const { clearCurrent } = establishmentsSlice.actions;

export default establishmentsSlice.reducer;
