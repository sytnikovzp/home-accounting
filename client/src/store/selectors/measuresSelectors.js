export const selectMeasures = (state) => state.measures.list;
export const selectTotalCount = (state) => state.measures.totalCount;
export const selectSelectedMeasure = (state) => state.measures.selected;

export const selectMeasuresIsLoadingList = (state) =>
  state.measures.isLoadingList;
export const selectMeasuresListLoadingError = (state) =>
  state.measures.listLoadingError;

export const selectMeasuresProcessingAction = (state) =>
  state.measures.isProcessingAction;
export const selectMeasuresActionError = (state) => state.measures.actionError;
