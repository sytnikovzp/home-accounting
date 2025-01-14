export const stylesLayoutBox = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const stylesLayoutGridContainer = {
  flexGrow: 1,
  backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
};

export const stylesLayoutXLContainer = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const stylesLayoutXLGridContainer = {
  flexGrow: 1,
  flexWrap: 'nowrap',
};

export const stylesLayoutNavBarDesktop = {
  display: { xs: 'none', md: 'block' },
  width: '190px',
  flexShrink: 0,
};

export const stylesLayoutNavBarMobile = {
  display: { xs: 'block', md: 'none' },
};

export const stylesLayoutOutlet = {
  flexGrow: 1,
  flexBasis: '0',
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'auto',
};

export const stylesLayoutServiceBlock = {
  flexShrink: 0,
  display: { xs: 'block', md: 'flex' },
  maxWidth: 'calc(100% - 190px)',
};
