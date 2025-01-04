import {
  Alert,
  AlertTitle,
  Box,
  Fade,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import {
  stylesCustomModalContentBox,
  stylesCustomModalFadeBox,
  stylesCustomModalIconButton,
} from '../../styles';

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
        <Box sx={stylesCustomModalFadeBox} position='relative'>
          {showCloseButton && (
            <IconButton
              aria-label='Закрити'
              onClick={onClose}
              sx={stylesCustomModalIconButton}
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
          <Box id='custom-modal-description' sx={stylesCustomModalContentBox}>
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
