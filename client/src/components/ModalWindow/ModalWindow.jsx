import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';

import CloseIcon from '@mui/icons-material/Close';

import ConfirmMessage from '@/src/components/ModalWindow/ConfirmMessage';
import ModalActionsOnCenter from '@/src/components/ModalWindow/ModalActionsOnCenter';
import ModalActionsOnRight from '@/src/components/ModalWindow/ModalActionsOnRight';
import ModalBody from '@/src/components/ModalWindow/ModalBody';
import ModalCloseButton from '@/src/components/ModalWindow/ModalCloseButton';
import ModalDeleteButtons from '@/src/components/ModalWindow/ModalDeleteButtons';
import ModalHeader from '@/src/components/ModalWindow/ModalHeader';
import Preloader from '@/src/components/Preloader/Preloader';

import {
  stylesModalWindowFadeBox,
  stylesModalWindowIconButton,
} from '@/src/styles';

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
