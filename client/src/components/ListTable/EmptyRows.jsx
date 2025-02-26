import { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import {
  stylesListTableBorderEmptyRow,
  stylesListTableHeightEmptyRow,
} from '../../styles';

function EmptyRows({ columns, rows, pageSize }) {
  const emptyRowsCount = pageSize - rows.length;

  const emptyRows = useMemo(
    () =>
      Array.from({ length: emptyRowsCount }, (_, index) => (
        <TableRow key={`empty-row-${index}`} sx={stylesListTableHeightEmptyRow}>
          {Array.from({ length: columns.length }, (_, colIndex) => (
            <TableCell
              key={`empty-cell-${index}-${colIndex}`}
              sx={stylesListTableBorderEmptyRow}
            />
          ))}
        </TableRow>
      )),
    [emptyRowsCount, columns]
  );

  return <>{emptyRows}</>;
}

export default EmptyRows;
