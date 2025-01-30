export const stylesModalWindowFadeBox = {
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  left: '50%',
  maxWidth: 600,
  minHeight: 'auto',
  p: 2,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: { sm: 450, xs: '90%' },
};

export const stylesModalWindowIconButton = {
  color: (theme) => theme.palette.grey[700],
  position: 'absolute',
  right: 12,
  top: 12,
};

export const stylesModalWindowContentBox = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};
