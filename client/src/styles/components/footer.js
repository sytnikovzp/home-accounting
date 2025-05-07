export const stylesFooterBox = {
  backgroundColor: '#C8E6C9',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  color: '#333',
  py: 2,
  mt: 'auto',
};

export const stylesFooterContainer = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
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
  '&:hover': { color: '#2E7D32' },
  color: '#555',
  transition: 'color 0.3s ease',
};
