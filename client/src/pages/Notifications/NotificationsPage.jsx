import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import InfoMessage from '../../components/InfoMessage/InfoMessage';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const severity = params.get('severity') || 'info';
  const title = params.get('title') || 'Повідомлення';
  const message = params.get('message') || 'Невідоме повідомлення';

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const actions = useMemo(
    () => [
      <Button
        key='gohome'
        fullWidth
        color='success'
        size='large'
        variant='contained'
        onClick={handleModalClose}
      >
        На головну
      </Button>,
    ],
    [handleModalClose]
  );

  const content = useMemo(
    () => <InfoMessage message={message} severity={severity} />,
    [message, severity]
  );

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      title={title}
      onClose={handleModalClose}
    />
  );
}

export default NotificationsPage;
