export const stylesHeaderAppBar = {
  backgroundImage: 'linear-gradient(to top, #9e9d24, #388e3c)',
  boxShadow: 3,
};

export const stylesHeaderToolbar = {
  display: 'flex',
  justifyContent: 'space-between',
  py: 0.5,
};

export const stylesHeaderUserBlockWrapper = {
  display: 'flex',
  alignItems: 'center',
};

export const stylesLogoIcon = {
  display: 'flex',
  width: '36px',
  height: '36px',
  marginRight: '16px',
};

export const stylesLogoBoxDesktop = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
};

export const stylesLogoTypographyDesktop = {
  mr: 2,
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.3rem',
  color: 'white',
};

export const stylesLogoBoxMobile = {
  display: { xs: 'flex', md: 'none' },
  alignItems: 'center',
  textDecoration: 'none',
};

export const stylesLogoTypographyMobile = {
  alignSelf: 'center',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.05rem',
  color: 'white',
  textAlign: 'center',
};

export const stylesHeaderUserAvatar = {
  width: { xs: 40, sm: 45 },
  height: { xs: 40, sm: 45 },
  border: '2px solid rgba(56, 142, 60, 0.3)',
  cursor: 'pointer',
};

export const stylesHeaderUserBlock = {
  display: 'flex',
  alignItems: 'center',
};

export const stylesAuthenticatedMenu = {
  overflow: 'visible',
  mt: 1.5,
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  '&:before': {
    position: 'absolute',
    top: 0,
    right: { xs: 22, sm: 25 },
    zIndex: 0,
    display: 'block',
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    content: '""',
    transform: 'translateY(-50%) rotate(45deg)',
  },
};

export const stylesWelcomeBox = {
  display: { xs: 'none', sm: 'block' },
  alignItems: 'center',
  marginRight: 2,
};
