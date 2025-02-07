import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { errorMessages, pageTitles } from '../../constants';
import usePageTitle from '../../hooks/usePageTitle';

import { stylesNotFoundBox } from '../../styles';

const { ERROR_MESSAGES } = errorMessages;
const { NOT_FOUND_PAGE_TITLES } = pageTitles;

function NotFoundPage() {
  const navigate = useNavigate();

  usePageTitle(location, NOT_FOUND_PAGE_TITLES);

  const randomMessage = useMemo(
    () => ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)],
    []
  );

  const handleGoHome = () => navigate('/');

  return (
    <Box sx={stylesNotFoundBox}>
      <Typography color='#388e3c' fontWeight={700} variant='h2'>
        Помилка 404
      </Typography>
      <Typography color='#2e7d32' fontWeight={500} sx={{ m: 3 }} variant='h4'>
        {randomMessage}
      </Typography>

      <Button
        color='success'
        sx={{ m: 3 }}
        variant='contained'
        onClick={handleGoHome}
      >
        На головну
      </Button>
    </Box>
  );
}

export default NotFoundPage;
