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
  display: { xs: 'none', md: 'block' },
  alignSelf: 'flex-start',
  position: 'sticky',
  flexShrink: 0,
  top: 64,
  minHeight: 'calc(100vh - 128px)',
  overflowY: 'auto',
  width: 290,
};

export const stylesLayoutOutlet = {
  flexGrow: 1,
  maxWidth: '100%',
  minWidth: 0,
  overflowX: 'auto',
};
