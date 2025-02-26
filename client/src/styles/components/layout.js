export const stylesLayoutBox = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const stylesLayoutBoxContainer = {
  display: 'flex',
  flexGrow: 1,
  backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
};

export const stylesLayoutXLContainer = {
  display: 'flex',
  flexGrow: 1,
};

export const stylesLayoutSideBar = {
  position: 'sticky',
  top: 64,
  alignSelf: 'flex-start',
  width: 290,
  minHeight: 'calc(100vh - 128px)',
  overflowY: 'auto',
  display: { xs: 'none', md: 'block' },
  flexShrink: 0,
};

export const stylesLayoutOutlet = {
  flexGrow: 1,
  maxWidth: '100%',
  minWidth: 0,
  overflowX: 'auto',
};
