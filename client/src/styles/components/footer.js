export const stylesFooterBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#C8E6C9',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  color: '#333',
  py: 1.5,
};

export const stylesFooterContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: {
    xs: 'center',
    sm: 'space-between',
  },
  flexDirection: {
    xs: 'column',
    sm: 'row',
  },
  gap: 1,
  py: 1,
  textAlign: 'center',
};

export const stylesFooterTypography = {
  color: '#555',
};

export const stylesFooterSocialLinks = {
  display: 'flex',
  gap: 1,
  mt: { xs: 1, sm: 0 },
};

export const stylesFooterIcon = {
  '&:hover': { color: '#2E7D32' },
  color: '#555',
  mx: 1,
  transition: 'color 0.3s ease',
};
