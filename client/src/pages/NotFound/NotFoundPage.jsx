import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { errorMessages } from '../../constants';

import { stylesErrorPageBox } from '../../styles';

const { ERROR_MESSAGES } = errorMessages;

function NotFoundPage() {
  const navigate = useNavigate();

  const randomMessage =
    ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

  const handleNavigateToHome = () => navigate('/');

  return (
    <Box sx={stylesErrorPageBox}>
      <Typography color='#FF5252' fontWeight={700} variant='h2'>
        Помилка 404
      </Typography>

      <Typography color='#2E7D32' fontWeight={500} sx={{ m: 3 }} variant='h4'>
        {randomMessage}
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

export default NotFoundPage;
