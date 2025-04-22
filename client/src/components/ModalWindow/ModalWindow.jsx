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
import ModalCloseButton from './ModalCloseButton';
import ModalDeleteButtons from './ModalDeleteButtons';
import ModalHeader from './ModalHeader';

import {
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '../../styles';

function ModalWindow({
  hideCloseIcon = false,
  disableBackdropClick = true,
  isOpen,
  title,
  onClose,
  children,
  isFetching = false,
  showCloseButton = false,
  showDeleteButtons = false,
  onDelete,
  deleteConfirmMessage,
  deleteButtonDisabled,
  actionsOnCenter,
}) {
  let modalBody = null;
  if (isFetching) {
    modalBody = <Preloader />;
  } else if (deleteConfirmMessage) {
    modalBody = <ConfirmMessage>{deleteConfirmMessage}</ConfirmMessage>;
  } else {
    modalBody = <ModalBody>{children}</ModalBody>;
  }

  const centerActions =
    actionsOnCenter ??
    (showCloseButton && <ModalCloseButton onClick={onClose} />);

  const rightActions = showDeleteButtons && (
    <ModalDeleteButtons
      disabled={deleteButtonDisabled}
      onCancel={onClose}
      onConfirm={onDelete}
    />
  );

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
          {!hideCloseIcon && (
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
          {centerActions && (
            <ModalActionsOnCenter>{centerActions}</ModalActionsOnCenter>
          )}
          {rightActions && (
            <ModalActionsOnRight>{rightActions}</ModalActionsOnRight>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalWindow;
