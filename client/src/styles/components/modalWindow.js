export const stylesModalWindowFadeBox = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  flexDirection: 'column',
  width: { xs: '90%', sm: 450 },
  maxWidth: 600,
  minHeight: 'auto',
  p: 2,
  borderRadius: 2,
  bgcolor: 'background.paper',
  boxShadow: 24,
  transform: 'translate(-50%, -50%)',
};

export const stylesModalWindowIconButton = {
  position: 'absolute',
  top: 12,
  right: 12,
  color: (theme) => theme.palette.grey[700],
};

export const stylesModalWindowContentBox = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

export const stylesModalWindowActionsOnCenter = {
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  mt: 2,
};

export const stylesModalWindowActionsOnRight = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2,
  mt: 2,
};
