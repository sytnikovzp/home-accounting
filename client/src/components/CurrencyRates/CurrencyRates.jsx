import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import { useFetchNBURatesQuery } from '../../store/services';

import Error from '../Error/Error';
import Preloader from '../Preloader/Preloader';

import CurrencyTable from './CurrencyTable';

import {
  stylesCurrencyRatesBox,
  stylesCurrencyRatesTypography,
} from '../../styles';

function CurrencyRates() {
  const {
    data: rates,
    isFetching,
    error: fetchError,
  } = useFetchNBURatesQuery();

  const isPreloaderVisible = useDelayedPreloader(isFetching);

  if (isPreloaderVisible) {
    return <Preloader message='Завантаження валют...' />;
  }

  if (fetchError) {
    return <Error error={fetchError} />;
  }

  if (!rates || rates.length === 0) {
    return (
      <Box sx={stylesCurrencyRatesBox}>
        <Typography sx={stylesCurrencyRatesTypography}>
          Недоступні курси валют
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={stylesCurrencyRatesBox}>
      <Typography sx={stylesCurrencyRatesTypography} variant='h6'>
        <CurrencyExchangeIcon color='text.primary' fontSize='medium' />
        Курси валют НБУ
      </Typography>
      <CurrencyTable rates={rates} />
    </Box>
  );
}

export default CurrencyRates;
