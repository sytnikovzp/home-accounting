import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import InfoModal from '../../components/ModalWindow/InfoModal';

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

  return (
    <InfoModal
      isOpen
      message={message}
      severity={severity}
      title={title}
      onClose={handleModalClose}
    />
  );
}

export default NotificationsPage;
