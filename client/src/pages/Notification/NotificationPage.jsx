import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import InfoModal from '../../components/ModalWindow/InfoModal';

function NotificationPage() {
  const [infoModalData, setInfoModalData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const success = params.get('success');

    if (error === 'expired-token') {
      setInfoModalData({
        severity: 'error',
        title: 'Сталася помилка',
        message: 'Це посилання вже не дійсне',
      });
    } else if (success === 'email-confirmed') {
      setInfoModalData({
        severity: 'success',
        title: 'Підтвердження email',
        message: 'Ваш email успішно підтверджений',
      });
    }
  }, [location]);

  const handleModalClose = useCallback(() => {
    setInfoModalData(null);
    navigate('/');
  }, [navigate]);

  return infoModalData ? (
    <InfoModal
      message={infoModalData.message}
      severity={infoModalData.severity}
      title={infoModalData.title}
      onClose={handleModalClose}
    />
  ) : (
    <InfoModal
      message={'Невідома помилка'}
      severity={'error'}
      title={'Сталася помилка'}
      onClose={handleModalClose}
    />
  );
}

export default NotificationPage;
