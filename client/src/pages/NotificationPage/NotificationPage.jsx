import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
// ==============================================================
import InfoMessage from '../../components/InfoMessage/InfoMessage';
import CustomModal from '../../components/CustomModal/CustomModal';

function NotificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const params = new URLSearchParams(location.search);
  const type = params.get('type') || 'info';
  const title = params.get('title') || 'Повідомлення';
  const message = params.get('message') || 'Невідоме повідомлення';

  useEffect(() => {
    document.title = title;
  }, [title]);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      content={<InfoMessage type={type} message={message} />}
      actions={
        <Button
          variant='contained'
          color='success'
          fullWidth
          onClick={handleClose}
        >
          На головну
        </Button>
      }
    />
  );
}

export default NotificationPage;
