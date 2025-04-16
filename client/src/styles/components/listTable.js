export const stylesListTableCell = {
  borderBottom: '1px solid #ccc',
  borderRight: '1px solid #ccc',
  height: '55px',
  padding: '8px 16px',
};

export const stylesListTableAvatarBox = {
  display: 'flex',
  justifyContent: 'center',
};

export const stylesListTableAvatarSize = {
  height: 40,
  width: 40,
};

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
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  mb: 2,
  overflowX: 'auto',
  width: '100%',
};

export const stylesListTablePreloader = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(185, 222, 187, 0.3)',
  height: '100%',
  width: '100%',
  zIndex: 1,
};

export const stylesListTableError = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(185, 222, 187, 0.3)',
  height: '100%',
  width: '100%',
  zIndex: 3,
};

export const stylesListTableActionsHeadTableCellModeration = {
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid darkgreen',
  color: 'common.white',
  fontWeight: 'bold',
  width: '120px',
};

export const stylesListTableActionsHeadTableCellNotModeration = {
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid darkgreen',
  color: 'common.white',
  fontWeight: 'bold',
  width: '85px',
};

export const stylesListTableActions = {
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid #ccc',
  padding: '8px 16px',
};

export const stylesListTableTableRow = {
  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
  '&:hover': { backgroundColor: 'action.selected' },
};

export const stylesListTableTableTypography = {
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
  borderRadius: '5px',
  boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',
  color: 'common.black',
  fontSize: '0.875rem',
  overflow: 'hidden',
  padding: '5px 10px',
  textOverflow: 'ellipsis',
  transition: 'all 0.3s ease-in-out',
  whiteSpace: 'nowrap',
};

export const stylesListTableFormControl = {
  flexGrow: 1,
  maxWidth: 250,
  minWidth: 120,
};

export const stylesListTableExpensesSum = {
  fontSize: '0.875rem',
  width: 200,
  ml: 'auto',
  textAlign: 'right',
};
