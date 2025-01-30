import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import InfoMessage from '../../components/InfoMessage/InfoMessage';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

const { NOTIFICATION_PAGE_TITLES } = pageTitles;

function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const severity = params.get('severity') || 'info';
  const title = params.get('title') || 'Повідомлення';
  const message = params.get('message') || 'Невідоме повідомлення';

  usePageTitle(location, NOTIFICATION_PAGE_TITLES);

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <ModalWindow
      isOpen
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
      title={title}
      onClose={handleModalClose}
    />
  );
}

export default NotificationsPage;
