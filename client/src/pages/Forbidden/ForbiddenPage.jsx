import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { stylesErrorPageBox } from '../../styles';

function ForbiddenPage() {
  const navigate = useNavigate();

  const handleNavigateToHome = () => navigate('/');

  return (
    <Box sx={stylesErrorPageBox}>
      <Typography color='#FF5252' fontWeight={700} variant='h2'>
        Помилка доступу
      </Typography>

      <Typography color='#2E7D32' fontWeight={500} sx={{ m: 3 }} variant='h4'>
        Вибачте, але Ви не маєте доступу до цієї сторінки.
      </Typography>

      <Button
        color='success'
        sx={{ m: 3 }}
        variant='contained'
        onClick={handleNavigateToHome}
      >
        Повернутися на головну
      </Button>
    </Box>
  );
}

export default ForbiddenPage;
