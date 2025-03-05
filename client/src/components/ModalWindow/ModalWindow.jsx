import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import CloseIcon from '@mui/icons-material/Close';

import ModalActions from './ModalActions';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';

import {
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '../../styles';

function ModalWindow({
  isOpen,
  onClose,
  title,
  children,
  actions,
  disableCloseButton = false,
  disableBackdropClick = true,
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
          {title && <ModalHeader>{title}</ModalHeader>}
          <ModalBody>{children}</ModalBody>
          {actions && <ModalActions>{actions}</ModalActions>}
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalWindow;
