import { Box, Typography } from '@mui/material';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import { useFetchNBURatesQuery } from '../../store/services';

import Error from '../Error/Error';
import Preloader from '../Preloader/Preloader';

import CurrencyTable from './CurrencyTable';

import { stylesCurrencyExchangeBox } from '../../styles';

function CurrencyRates() {
  const { data: rates, error, isLoading } = useFetchNBURatesQuery();

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження валют...' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!rates || rates.length === 0) {
    return <Typography>Немає доступних курсів валют.</Typography>;
  }

  return (
    <Box sx={stylesCurrencyExchangeBox}>
      <Typography sx={{ mt: 1 }} variant='h6'>
        Курси Національного Банку
      </Typography>
      <CurrencyTable rates={rates} />
    </Box>
  );
}

export default CurrencyRates;
