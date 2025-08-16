import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import useDelayedPreloader from '@/src/hooks/useDelayedPreloader';

import { useFetchNBURatesQuery } from '@/src/store/services';

import CurrencyTable from '@/src/components/CurrencyRates/CurrencyTable';
import Error from '@/src/components/Error';
import Preloader from '@/src/components/Preloader';

import {
  stylesCurrencyRatesBox,
  stylesCurrencyRatesTypography,
} from '@/src/styles';

function CurrencyRates() {
  const {
    data: ratesData,
    isFetching,
    error: fetchError,
  } = useFetchNBURatesQuery();

  const isPreloaderVisible = useDelayedPreloader(isFetching);

  if (isPreloaderVisible) {
    return <Preloader message='Завантаження валют...' />;
  }

  if (fetchError) {
    return <Error message={fetchError} />;
  }

  if (!ratesData || ratesData.length === 0) {
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
      <CurrencyTable rates={ratesData} />
    </Box>
  );
}

export default CurrencyRates;
