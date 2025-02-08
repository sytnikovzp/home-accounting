import { useMemo } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function CurrencyTable({ rates }) {
  const memoizedRates = useMemo(() => rates, [rates]);

  return (
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
          {memoizedRates.map(({ cc, txt, rate }) => (
            <TableRow key={cc}>
              <TableCell align='center'>{cc}</TableCell>
              <TableCell align='center'>{txt}</TableCell>
              <TableCell align='center'>{rate.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CurrencyTable;
