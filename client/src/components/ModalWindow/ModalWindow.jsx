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
  stylesModalWindowContentBox,
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '../../styles';

function ModalWindow({
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
      closeAfterTransition
      aria-describedby='custom-modal-description'
      aria-labelledby={title ? 'custom-modal-title' : null}
      open={isOpen}
      onClose={disableBackdropClick ? null : onClose}
    >
      <Fade in={isOpen}>
        <Box position='relative' sx={stylesModalWindowFadeBox}>
          {showCloseButton && (
            <IconButton
              aria-label='Закрити'
              sx={stylesModalWindowIconButton}
              onClick={onClose}
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
            <Alert severity={error?.severity || 'error'} sx={{ mb: 1 }}>
              <AlertTitle>{error?.title || 'error'}:</AlertTitle>
              {error?.message || 'error'}
            </Alert>
          )}
          <Box id='custom-modal-description' sx={stylesModalWindowContentBox}>
            {content}
          </Box>
          {actions && (
            <Box
              display='flex'
              flexDirection='column'
              gap={2}
              justifyContent='center'
              mt={2}
            >
              {actions}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalWindow;
