import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import InfoMessage from '../../components/InfoMessage/InfoMessage';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function NotificationPage() {
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const severity = params.get('severity') || 'info';
  const title = params.get('title') || 'Повідомлення';
  const message = params.get('message') || 'Невідоме повідомлення';

  const handleModalClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  const pageTitles = useMemo(
    () => ({
      default: 'Повідомлення | Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    document.title = pageTitles.default;
  }, [location, pageTitles]);

  return (
    <ModalWindow
      actions={
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleModalClose}
        >
          На головну
        </Button>
      }
      content={<InfoMessage message={message} severity={severity} />}
      isOpen={isOpen}
      title={title}
      onClose={handleModalClose}
    />
  );
}

export default NotificationPage;
