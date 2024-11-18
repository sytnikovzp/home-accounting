import { useEffect, useState } from 'react';
import { getNBURates } from '../../api';
// ==============================================================
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
} from '@mui/material';
// ==============================================================
import Preloader from '../Preloader/Preloader';
import Error from '../Error/Error';

const CURRENCY_CODES = ['USD', 'EUR', 'GBP'];

const CurrencyExchange = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    try {
      const allRates = await getNBURates();
      const filteredRates = allRates.filter(({ cc }) =>
        CURRENCY_CODES.includes(cc)
      );
      setRates(filteredRates);
    } catch (err) {
      console.error('Не вдалося завантажити дані: ', err);
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (loading) return <Preloader />;
  if (error) return <Error error={error} />;

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant='h6' gutterBottom>
        Курси валют НБУ
      </Typography>
      <TableContainer style={{ margin: '0 auto' }}>
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
    </div>
  );
};

export default CurrencyExchange;
