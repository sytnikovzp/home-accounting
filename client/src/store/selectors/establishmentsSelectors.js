export const selectEstablishments = (state) => state.establishments.list;
export const selectTotalCount = (state) => state.establishments.totalCount;
export const selectSelectedEstablishment = (state) =>
  state.establishments.selected;

export const selectEstablishmentsIsLoadingList = (state) =>
  state.establishments.isLoadingList;
export const selectEstablishmentsListLoadingError = (state) =>
  state.establishments.listLoadingError;

export const selectEstablishmentsProcessingAction = (state) =>
  state.establishments.isProcessingAction;
export const selectEstablishmentsActionError = (state) =>
  state.establishments.actionError;
