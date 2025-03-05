import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function NotificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultResponse = useMemo(
    () => ({
      severity: 'error',
      title: 'Сталася помилка',
      message: 'Невідома помилка',
    }),
    []
  );

  const [responseData, setResponseData] = useState(defaultResponse);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const success = params.get('success');
    let data = null;

    switch (true) {
      case error === 'expired-token':
        data = {
          severity: 'error',
          title: 'Сталася помилка',
          message: 'Це посилання вже не дійсне',
        };
        break;
      case success === 'email-confirmed':
        data = {
          severity: 'success',
          title: 'Підтвердження email',
          message: 'Ваш email успішно підтверджений',
        };
        break;
      default:
        data = defaultResponse;
    }

    setResponseData(data);
  }, [defaultResponse, location]);

  const handleModalClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <ModalWindow isOpen title={responseData.title} onClose={handleModalClose}>
      <Alert severity={responseData.severity}>{responseData.message}</Alert>
      <Box display='flex' justifyContent='center' mt={2}>
        <Button
          fullWidth
          color='success'
          variant='contained'
          onClick={handleModalClose}
        >
          Закрити
        </Button>
      </Box>
    </ModalWindow>
  );
}

export default NotificationPage;
