// ==============================================================
// Header component

export const stylesAppBar = {
  boxShadow: 3,
  backgroundImage: 'linear-gradient(to top, #9e9d24, #388e3c)',
};

export const stylesToolbar = {
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

export const stylesBoxLogoDesktop = {
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

export const stylesBoxLogoMobile = {
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

export const stylesUserMenu = {
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

// ==============================================================
// Layout component

export const stylesBoxLayout = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export const stylesGridContainer = {
  flexGrow: 1,
  backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
};

export const stylesNavBarDesktop = {
  display: { xs: 'none', md: 'block' },
  width: '190px',
  flexShrink: 0,
};

export const stylesNavBarMobile = {
  display: { xs: 'block', md: 'none' },
};

export const stylesServiceBlock = {
  flexShrink: 0,
  display: { xs: 'block', md: 'flex' },
  width: { xs: '100%', md: 'auto' },
};

// ==============================================================
// NavBar component

export const stylesListItemText = {
  color: 'text.primary',
};

export const stylesNavMenuItems = {
  position: { md: 'sticky', xs: 'static' },
  top: 0,
  minHeight: { md: '70vh', xs: 'auto' },
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: { md: 'column', xs: 'row' },
  alignItems: { md: 'center', xs: 'flex-start' },
  justifyContent: { md: 'flex-start', xs: 'space-between' },
  borderRight: { md: '1px solid rgba(0, 0, 0, 0.1)', xs: 'none' },
};

// ==============================================================
// ServiceBlock component

export const stylesServiceBlockBox = {
  position: { md: 'sticky', xs: 'static' },
  top: 0,
  minHeight: { md: '70vh', xs: 'auto' },
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: { md: 'flex-start', xs: 'center' },
  borderLeft: { md: '1px solid rgba(0, 0, 0, 0.1)', xs: 'none' },
  borderTop: { xs: '1px solid rgba(0, 0, 0, 0.1)', md: 'none' },
};

// ==============================================================
// Footer component

export const stylesFooterBox = {
  py: 1.5,
  backgroundColor: '#c8e6c9',
  color: '#333',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
};

export const stylesFooterIcon = {
  mx: 1,
  color: '#555',
  transition: 'color 0.3s ease',
  '&:hover': { color: '#2E7D32' },
};

// ==============================================================
// Preloader component

export const stylesPreloaderTitle = {
  marginBottom: '20px',
  textAlign: 'center',
};

// ==============================================================
// CustomModal component

export const stylesFadeBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  maxWidth: 600,
};

export const stylesContentBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
};

// ==============================================================
// ==============================================================
// ==============================================================
// Auth page

export const stylesAuthBox = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const stylesAuthTitle = {
  fontWeight: 600,
};

export const stylesAuthAvatar = {
  mx: 'auto',
  width: 50,
  height: 50,
  mb: 2,
};

export const stylesErrorMessage = {
  mt: 1,
  minHeight: '24px',
  textAlign: 'center',
};
