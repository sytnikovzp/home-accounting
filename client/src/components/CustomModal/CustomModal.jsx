import { Modal, Fade, Box, Typography } from '@mui/material';
// ==============================================================
import { stylesFadeBox, stylesContentBox } from '../../styles/theme';

function CustomModal({
  isOpen,
  onClose,
  title,
  content,
  actions,
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
        <Box sx={stylesFadeBox}>
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
          <Box sx={stylesContentBox}>{content}</Box>
          {actions && (
            <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
              {actions}
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default CustomModal;
