import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import CustomModal from '../../components/CustomModal/CustomModal';
import InfoMessage from '../../components/InfoMessage/InfoMessage';

function NotificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const params = new URLSearchParams(location.search);
  const severity = params.get('severity') || 'info';
  const title = params.get('title') || 'Повідомлення';
  const message = params.get('message') || 'Невідоме повідомлення';

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <CustomModal
      actions={
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleClose}
        >
          На головну
        </Button>
      }
      content={<InfoMessage message={message} severity={severity} />}
      isOpen={isOpen}
      title={title}
      onClose={handleClose}
    />
  );
}

export default NotificationPage;
