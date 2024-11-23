import { Modal, Fade, Box, Typography } from '@mui/material';
// ==============================================================
import { stylesFadeBox, stylesContentBox } from '../../styles/theme';

function CustomModal({
  isOpen,
  onClose,
  modalType = 'form',
  title,
  content,
  actions,
  disableBackdropClick = false,
}) {
  const isFormModal = modalType === 'form';
  const isDialogModal = modalType === 'dialog';

  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      onClose={disableBackdropClick ? null : onClose}
      aria-labelledby='custom-modal-title'
      aria-describedby='custom-modal-description'
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            ...stylesFadeBox,
            minHeight: isFormModal ? 'auto' : 200,
          }}
        >
          {title && (
            <Box id='custom-modal-title' mb={2}>
              {typeof title === 'string' ? (
                <Typography
                  component='h1'
                  variant={isDialogModal ? 'h6' : 'h5'}
                >
                  {title}
                </Typography>
              ) : (
                title
              )}
            </Box>
          )}
          <Box
            sx={{
              ...stylesContentBox,
              minHeight: isDialogModal ? 100 : 200,
            }}
          >
            {content}
          </Box>
          {actions && (
            <Box
              mt={2}
              display='flex'
              justifyContent={isDialogModal ? 'space-between' : 'flex-end'}
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
