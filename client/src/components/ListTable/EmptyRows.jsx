import { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import {
  stylesEmptyRowsBorderEmptyRow,
  stylesEmptyRowsHeightEmptyRow,
} from '../../styles';

function EmptyRows({ columns, pageSize, rows }) {
  const emptyRowsCount = pageSize - rows.length;

  const emptyRows = useMemo(
    () =>
      Array.from({ length: emptyRowsCount }, (_, index) => (
        <TableRow key={`empty-row-${index}`} sx={stylesEmptyRowsHeightEmptyRow}>
          {Array.from({ length: columns.length }, (_, colIndex) => (
            <TableCell
              key={`empty-cell-${index}-${colIndex}`}
              sx={stylesEmptyRowsBorderEmptyRow}
            />
          ))}
        </TableRow>
      )),
    [emptyRowsCount, columns]
  );

  return <>{emptyRows}</>;
}

export default EmptyRows;
