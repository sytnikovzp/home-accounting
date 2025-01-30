export const stylesLayoutBox = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const stylesLayoutGridContainer = {
  backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
  flexGrow: 1,
};

export const stylesLayoutXLContainer = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
};

export const stylesLayoutXLGridContainer = {
  flexGrow: 1,
  flexWrap: 'nowrap',
};

export const stylesLayoutNavBarDesktop = {
  display: { md: 'block', xs: 'none' },
  flexShrink: 0,
  width: '190px',
};

export const stylesLayoutNavBarMobile = {
  display: { md: 'none', xs: 'block' },
};

export const stylesLayoutOutlet = {
  flexBasis: '0',
  flexGrow: 1,
  maxWidth: '100%',
  minWidth: 0,
  overflowX: 'auto',
};

export const stylesLayoutServiceBlock = {
  display: { md: 'flex', xs: 'block' },
  flexShrink: 0,
  maxWidth: 'calc(100% - 190px)',
};
