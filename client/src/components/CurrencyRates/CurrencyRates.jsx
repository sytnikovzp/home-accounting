import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import { useFetchNBURatesQuery } from '../../store/services';

import Error from '../Error/Error';
import Preloader from '../Preloader/Preloader';

import CurrencyTable from './CurrencyTable';

import { stylesCurrencyExchangeBox } from '../../styles';

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
      <Box sx={stylesCurrencyExchangeBox}>
        <Typography sx={{ mt: 3 }}>Немає доступних курсів валют</Typography>
      </Box>
    );
  }

  return (
    <Box sx={stylesCurrencyExchangeBox}>
      <Typography sx={{ mt: 1 }} variant='h6'>
        Курси валют НБУ
      </Typography>
      <CurrencyTable rates={rates} />
    </Box>
  );
}

export default CurrencyRates;
