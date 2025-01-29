export const stylesFileUploadMainBox = {
  mt: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

export const stylesFileUploadAvatarBox = {
  position: 'relative',
  width: '120px',
  height: '120px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
};
