import { Modal, Fade, Box, Typography, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// ==============================================================
import { stylesFadeBox, stylesContentBox } from '../../styles/theme';

function CustomModal({
  isOpen,
  onClose,
  showCloseButton = false,
  title,
  content,
  actions,
  error,
  disableBackdropClick = false,
}) {
  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      onClose={disableBackdropClick ? null : onClose}
      aria-labelledby='custom-modal-title'
      aria-describedby='custom-modal-description'
    >
      <Fade in={isOpen}>
        <Box sx={stylesFadeBox} position='relative'>
          {showCloseButton && (
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: (theme) => theme.palette.grey[700],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {title && (
            <Box id='custom-modal-title' mb={2}>
              {typeof title === 'string' ? (
                <Typography component='h1' variant='h5'>
                  {title}
                </Typography>
              ) : (
                title
              )}
            </Box>
          )}
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={stylesContentBox}>{content}</Box>
          {actions && (
            <Box mt={2} display='flex' justifyContent='center' gap={2}>
              {actions}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default CustomModal;
