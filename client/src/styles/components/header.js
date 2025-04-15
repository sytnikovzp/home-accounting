export const stylesHeaderAppBar = {
  backgroundImage: 'linear-gradient(to top, #9e9d24, #388e3c)',
  boxShadow: 3,
};

export const stylesHeaderToolbar = {
  display: 'flex',
  justifyContent: 'space-between',
  py: 0.5,
};

export const stylesLogoIcon = {
  display: 'flex',
  marginRight: '16px',
  height: '36px',
  width: '36px',
};

export const stylesLogoBoxDesktop = {
  display: { md: 'flex', xs: 'none' },
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
};

export const stylesLogoTypographyDesktop = {
  color: 'white',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.3rem',
  mr: 2,
};

export const stylesLogoBoxMobile = {
  display: { md: 'none', xs: 'flex' },
  alignItems: 'center',
  textDecoration: 'none',
};

export const stylesLogoTypographyMobile = {
  alignSelf: 'center',
  color: 'white',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.05rem',
  textAlign: 'center',
};

export const stylesHeaderUserAvatar = {
  border: '2px solid rgba(56, 142, 60, 0.3)',
  cursor: 'pointer',
  height: { sm: 45, xs: 40 },
  width: { sm: 45, xs: 40 },
};

export const stylesAuthenticatedMenu = {
  '&:before': {
    display: 'block',
    bgcolor: 'background.paper',
    content: '""',
    position: 'absolute',
    right: { sm: 25, xs: 22 },
    top: 0,
    transform: 'translateY(-50%) rotate(45deg)',
    height: 10,
    width: 10,
    zIndex: 0,
  },
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1.5,
  overflow: 'visible',
};

export const stylesWelcomeBox = {
  display: { sm: 'block', xs: 'none' },
  alignItems: 'center',
  marginRight: 2,
};
