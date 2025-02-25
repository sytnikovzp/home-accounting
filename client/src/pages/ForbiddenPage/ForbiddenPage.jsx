import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { stylesErrorPageBox } from '../../styles';

function ForbiddenPage() {
  const navigate = useNavigate();

  const handleNavigateToHome = () => navigate('/');

  return (
    <Box aria-live='assertive' role='alert' sx={stylesErrorPageBox}>
      <Typography color='#d32f2f' fontWeight={700} mb={2} variant='h5'>
        Вибачте, ви не маєте доступу до цієї сторінки
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
