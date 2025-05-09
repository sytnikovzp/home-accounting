export const stylesListTableCell = {
  height: '55px',
  padding: '8px 16px',
  borderRight: '1px solid #ccc',
  borderBottom: '1px solid #ccc',
};

export const stylesListTableAvatarBox = {
  display: 'flex',
  justifyContent: 'center',
};

export const stylesListTableAvatarSize = { width: 40, height: 40 };

export const stylesListTableTextColor = {
  color: 'common.black',
};

export const stylesListTableHeightEmptyRow = {
  height: 57,
};

export const stylesListTableBorderEmptyRow = {
  borderBottom: 'none',
};

export const stylesListTableContainer = {
  overflowX: 'auto',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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

export const stylesListTableTableTypography = {
  overflow: 'hidden',
  padding: '5px 10px',
  borderRadius: '5px',
  boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',
  fontSize: '0.875rem',
  color: 'common.black',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
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
