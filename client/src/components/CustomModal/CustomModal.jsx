import { Modal, Fade, Box, Typography } from '@mui/material';
import { stylesFadeBox, stylesFormBox } from '../../styles/theme';

function CustomModal({
  isOpen,
  onClose,
  title,
  content,
  actions,
  styles = {},
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
        <Box sx={{ ...stylesFadeBox, ...styles.fadeBox }}>
          {title && (
            <Typography id='custom-modal-title' variant='h6' mb={2}>
              {title}
            </Typography>
          )}
          <Box sx={{ ...stylesFormBox, ...styles.formBox }}>{content}</Box>
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
