export const stylesFileUploadMainBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  mb: 2,
};

export const stylesFileUploadAvatarBox = {
  position: 'relative',
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  width: '120px',
  height: '120px',
  border: '1px solid #DDD',
  borderRadius: '8px',
  backgroundColor: '#F9F9F9',
};

export const stylesFileUploadAvatar = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

export const stylesFileUploadIconButton = {
  position: 'absolute',
  top: 1,
  right: 1,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
};
