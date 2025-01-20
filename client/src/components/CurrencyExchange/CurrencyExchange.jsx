import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import {
  selectNBURates,
  selectNBURatesError,
  selectNBURatesIsLoading,
} from '../../store/selectors/nbuExchangesSelectors';
import { fetchNBURates } from '../../store/thunks/nbuExchangesThunks';

import Error from '../Error/Error';
import Preloader from '../Preloader/Preloader';

import { stylesCurrencyExchangeBox } from '../../styles';

function CurrencyExchange() {
  const dispatch = useDispatch();

  const rates = useSelector(selectNBURates);
  const isLoading = useSelector(selectNBURatesIsLoading);
  const error = useSelector(selectNBURatesError);

  useEffect(() => {
    dispatch(fetchNBURates());
  }, [dispatch]);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження валют...' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box sx={stylesCurrencyExchangeBox}>
      <Typography sx={{ mt: 1 }} variant='h6'>
        Курси Національного Банку
      </Typography>
      <TableContainer sx={{ margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Валюта', 'Опис', 'Курс'].map((header) => (
                <TableCell key={header} align='center'>
                  <strong>{header}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rates.map(({ cc, txt, rate }) => (
              <TableRow key={cc}>
                <TableCell align='center'>{cc}</TableCell>
                <TableCell align='center'>{txt}</TableCell>
                <TableCell align='center'>{rate.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CurrencyExchange;
