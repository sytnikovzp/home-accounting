export const stylesCustomModalFadeBox = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  minHeight: 'auto',
  maxWidth: 600,
};

export const stylesCustomModalIconButton = {
  position: 'absolute',
  top: 12,
  right: 12,
  color: (theme) => theme.palette.grey[700],
};

export const stylesCustomModalContentBox = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};
