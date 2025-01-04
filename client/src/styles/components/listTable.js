export const stylesListTableHeadCell = {
  fontWeight: 'bold',
  color: 'common.white',
  borderBottom: '1px solid #ccc',
  cursor: 'pointer',
};

export const stylesListTableCell = {
  borderRight: '1px solid #ccc',
  padding: '8px 16px',
  borderBottom: '1px solid #ccc',
};

export const stylesListTableAvatarBox = {
  display: 'flex',
  justifyContent: 'center',
};

export const stylesListTableAvatarSize = {
  width: 40,
  height: 40,
};

export const stylesListTableHeadBackgroundColor = {
  backgroundColor: 'success.main',
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
  width: '100%',
  overflowX: 'auto',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  mb: 2,
};

export const stylesListTableTable = {
  width: '100%',
  borderCollapse: 'collapse',
};

export const stylesListTableActionsHeadTableCell = {
  fontWeight: 'bold',
  color: 'common.white',
  borderLeft: '1px solid darkgreen',
  borderBottom: '1px solid #ccc',
};

export const stylesListTableActionsBodyTableCell = {
  padding: '8px 16px',
  borderBottom: '1px solid #ccc',
  borderLeft: '1px solid #ccc',
  width: '140px',
};

export const stylesListTableTableRow = {
  '&:nth-of-type(2n)': { backgroundColor: 'action.hover' },
  '&:hover': { backgroundColor: 'action.selected' },
};

export const stylesListTableTableTypography = {
  fontSize: '0.875rem',
  color: 'common.black',
  padding: '5px 10px',
  borderRadius: '5px',
  boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
};

export const stylesListTableFormControl = {
  flexGrow: 1,
  minWidth: 120,
  maxWidth: '365px',
};
