import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Fade, Box } from '@mui/material';
// ==============================================================
import AuthForm from '../../components/AuthForm/AuthForm';

function AuthPage({ isOpen, onClose, checkAuthentication }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      aria-labelledby='auth-modal-title'
      aria-describedby='auth-modal-description'
      onClose={handleClose}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%',
              sm: 400,
              md: 400,
            },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <AuthForm onClose={onClose} checkAuthentication={checkAuthentication} />
        </Box>
      </Fade>
    </Modal>
  );
}

export default AuthPage;
