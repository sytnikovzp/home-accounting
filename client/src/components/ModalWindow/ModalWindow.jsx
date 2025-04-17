import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import CloseIcon from '@mui/icons-material/Close';

import Preloader from '../Preloader/Preloader';

import ConfirmMessage from './ConfirmMessage';
import ModalActionsOnCenter from './ModalActionsOnCenter';
import ModalActionsOnRight from './ModalActionsOnRight';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';

import {
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '../../styles';

function ModalWindow({
  disableCloseButton = false,
  disableBackdropClick = true,
  isOpen,
  title,
  onClose,
  children,
  isFetching = false,
  actionsOnCenter,
  actionsOnRight,
  confirmMessage,
}) {
  let modalBody = null;
  if (isFetching) {
    modalBody = <Preloader />;
  } else if (confirmMessage) {
    modalBody = <ConfirmMessage>{confirmMessage}</ConfirmMessage>;
  } else {
    modalBody = <ModalBody>{children}</ModalBody>;
  }

  return (
    <Modal
      closeAfterTransition
      aria-describedby='modal-window-description'
      {...(title && { 'aria-labelledby': 'modal-window-title' })}
      open={isOpen}
      {...(!disableBackdropClick && { onClose })}
    >
      <Fade in={isOpen}>
        <Box sx={stylesModalWindowFadeBox}>
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
          {modalBody}
          {actionsOnCenter && (
            <ModalActionsOnCenter>{actionsOnCenter}</ModalActionsOnCenter>
          )}
          {actionsOnRight && (
            <ModalActionsOnRight>{actionsOnRight}</ModalActionsOnRight>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalWindow;
