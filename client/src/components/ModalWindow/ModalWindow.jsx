import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import Preloader from '../Preloader/Preloader';

import {
  stylesModalWindowContentBox,
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '../../styles';

function ModalWindow({
  isOpen,
  isFetching,
  onClose,
  disableCloseButton = false,
  title,
  content,
  actions,
  disableBackdropClick = false,
}) {
  return (
    <Modal
      closeAfterTransition
      aria-describedby='modal-window-description'
      aria-labelledby={title ? 'modal-window-title' : null}
      open={isOpen}
      onClose={disableBackdropClick ? null : onClose}
    >
      <Fade in={isOpen}>
        <Box position='relative' sx={stylesModalWindowFadeBox}>
          {!disableCloseButton && (
            <IconButton
              aria-label='Закрити'
              sx={stylesModalWindowIconButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          )}
          {title && (
            <Box id='modal-window-title' mb={2}>
              {typeof title === 'string' ? (
                <Typography variant='h6'>{title}</Typography>
              ) : (
                title
              )}
            </Box>
          )}
          <Box id='modal-window-description' sx={stylesModalWindowContentBox}>
            {isFetching ? <Preloader /> : content}
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
