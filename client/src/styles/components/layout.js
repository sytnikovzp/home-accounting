export const stylesLayoutBox = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const stylesLayoutBoxContainer = {
  display: 'flex',
  flexGrow: 1,
  backgroundImage: 'linear-gradient(to bottom, #E8F5E9, #C8E6C9)',
};

export const stylesLayoutXLContainer = {
  display: 'flex',
  flexGrow: 1,
};

export const stylesLayoutSideBar = {
  position: 'sticky',
  top: 64,
  display: { xs: 'none', md: 'block' },
  overflowY: 'auto',
  flexShrink: 0,
  alignSelf: 'flex-start',
  width: 290,
};

export const stylesLayoutOutlet = {
  overflowX: 'auto',
  flexGrow: 1,
  minWidth: 0,
  maxWidth: '100%',
};
