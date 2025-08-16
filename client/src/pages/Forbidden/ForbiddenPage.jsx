import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  stylesErrorPageBox,
  stylesErrorPageButton,
  stylesErrorPageTypography,
} from '@/src/styles';

function ForbiddenPage() {
  const navigate = useNavigate();

  const handleNavigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Box sx={stylesErrorPageBox}>
      <Typography color='#FF5252' fontWeight={700} variant='h2'>
        Помилка доступу
      </Typography>

      <Typography
        color='#2E7D32'
        fontWeight={500}
        sx={stylesErrorPageTypography}
        variant='h4'
      >
        Вибачте, але Ви не маєте доступу до цієї сторінки.
      </Typography>

      <Button
        color='success'
        sx={stylesErrorPageButton}
        variant='contained'
        onClick={handleNavigateToHome}
      >
        Повернутися на головну
      </Button>
    </Box>
  );
}

export default ForbiddenPage;
