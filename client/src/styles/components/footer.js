export const stylesFooterBox = {
  mt: 'auto',
  py: 2,
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  backgroundColor: '#C8E6C9',
  color: '#333',
};

export const stylesFooterContainer = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1.5,
  textAlign: { xs: 'center', sm: 'left' },
};

export const stylesFooterTypography = {
  color: '#555',
};

export const stylesFooterSocialLinks = {
  display: 'flex',
  gap: 2,
};

export const stylesFooterIcon = {
  display: 'flex',
  alignItems: 'center',
  color: '#555',
  transition: 'color 0.3s ease',
  '&:hover': { color: '#2E7D32' },
};
