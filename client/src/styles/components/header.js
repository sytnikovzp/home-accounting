export const stylesHeaderAppBar = {
  boxShadow: 3,
  backgroundImage: 'linear-gradient(to top, #9e9d24, #388e3c)',
};

export const stylesHeaderToolbar = {
  display: 'flex',
  justifyContent: 'space-between',
  py: 0.5,
};

export const stylesHeaderIcon = {
  width: '36px',
  height: '36px',
  marginRight: '16px',
  display: 'flex',
};

export const stylesHeaderBoxLogoDesktop = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
};

export const stylesHeaderTitleDesktop = {
  mr: 2,
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.3rem',
  color: 'white',
  textDecoration: 'none',
};

export const stylesHeaderBoxLogoMobile = {
  display: { xs: 'flex', md: 'none' },
  alignItems: 'center',
};

export const stylesHeaderTitleMobile = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  letterSpacing: '.05rem',
  color: 'white',
  textAlign: 'center',
  alignSelf: 'center',
};

export const stylesHeaderUserAvatar = {
  cursor: 'pointer',
  border: '2px solid rgba(56, 142, 60, 0.3)',
  width: { xs: 40, sm: 45 },
  height: { xs: 40, sm: 45 },
};

export const stylesHeaderUserMenu = {
  overflow: 'visible',
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  mt: 1.5,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    right: { xs: 22, sm: 25 },
    width: 10,
    height: 10,
    bgcolor: 'background.paper',
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 0,
  },
};

export const stylesHeaderWelcomeBlock = {
  display: { xs: 'none', sm: 'block' },
  alignItems: 'center',
  marginRight: 2,
};
