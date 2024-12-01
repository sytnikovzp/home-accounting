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
  const [errorMessage, setErrorMessage] = useState(null);
  const [rates, setRates] = useState([]);

  const fetchRates = async () => {
    try {
      const filteredRates = await restController.fetchFilteredRates();
      setRates(filteredRates);
    } catch (error) {
      console.error('Не вдалося завантажити курси валют:', error.message);
      setErrorMessage('Помилка завантаження валют');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (isLoading) return <Preloader message='Завантаження валют...' />;
  if (errorMessage) return <Error error={errorMessage} />;

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
