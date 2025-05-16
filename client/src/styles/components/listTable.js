export const stylesListTableContainer = {
  overflowX: 'auto',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

export const stylesListTableContainerBox = {
  position: 'relative',
};

export const stylesListTablePreloader = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(185, 222, 187, 0.3)',
};

export const stylesListTableError = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 3,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(185, 222, 187, 0.3)',
};

export const stylesListTableTableHeadTableRow = {
  backgroundColor: 'success.main',
};

export const stylesListTableActionsHeadTableCellModeration = {
  width: '120px',
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid darkgreen',
  fontWeight: 'bold',
  color: 'common.white',
};

export const stylesListTableActionsHeadTableCellNotModeration = {
  width: '85px',
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid darkgreen',
  fontWeight: 'bold',
  color: 'common.white',
};

export const stylesListTableActions = {
  padding: '8px 16px',
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid #ccc',
};

export const stylesListTableTableRow = {
  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
  '&:hover': { backgroundColor: 'action.selected' },
};

export const stylesListTableFormControl = {
  flexGrow: 1,
  minWidth: 120,
  maxWidth: 250,
};

export const stylesListTableExpensesSum = {
  width: 200,
  ml: 'auto',
  fontSize: '0.875rem',
  textAlign: 'right',
};
