import {
  Modal,
  Fade,
  Box,
  Typography,
  Alert,
  IconButton,
  AlertTitle,
} from '@mui/material';
import { Close } from '@mui/icons-material';
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
      aria-labelledby={title ? 'custom-modal-title' : undefined}
      aria-describedby='custom-modal-description'
    >
      <Fade in={isOpen}>
        <Box sx={stylesFadeBox} position='relative'>
          {showCloseButton && (
            <IconButton
              aria-label='Закрити'
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: (theme) => theme.palette.grey[700],
              }}
            >
              <Close />
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
            <Alert severity={error.severity || 'error'} sx={{ mb: 1 }}>
              <AlertTitle>{error.title}:</AlertTitle>
              {error.message}
            </Alert>
          )}
          <Box id='custom-modal-description' sx={stylesContentBox}>
            {content}
          </Box>
          {actions && (
            <Box
              mt={2}
              display='flex'
              flexDirection='column'
              justifyContent='center'
              gap={2}
            >
              {actions}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default CustomModal;
