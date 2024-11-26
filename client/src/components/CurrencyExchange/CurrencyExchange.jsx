import { useEffect, useState } from 'react';
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
import restController from '../../api/rest/restController';
// ==============================================================
import Preloader from '../Preloader/Preloader';
import Error from '../Error/Error';

function CurrencyExchange() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState([]);

  const fetchRates = async () => {
    try {
      const filteredRates = await restController.fetchFilteredRates();
      setRates(filteredRates);
    } catch (err) {
      console.error('Не вдалося завантажити курси валют:', err.message);
      setError('Помилка завантаження курсів');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (isLoading) return <Preloader message = 'Завантаження курсів...' />;
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
}

export default CurrencyExchange;
