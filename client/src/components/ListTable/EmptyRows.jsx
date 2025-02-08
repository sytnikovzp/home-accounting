import { useMemo } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import {
  stylesListTableBorderEmptyRow,
  stylesListTableHeightEmptyRow,
} from '../../styles';

function EmptyRows({ columns, rows, pageSize, isMobile }) {
  const emptyRowsCount = pageSize - rows.length;

  const emptyRows = useMemo(
    () =>
      Array.from({ length: emptyRowsCount }, (_, index) => (
        <TableRow key={`empty-row-${index}`} sx={stylesListTableHeightEmptyRow}>
          {columns.map((_, colIndex) => (
            <TableCell
              key={`empty-cell-${index}-${colIndex}`}
              sx={stylesListTableBorderEmptyRow}
            />
          ))}
          {!isMobile && <TableCell sx={stylesListTableBorderEmptyRow} />}
        </TableRow>
      )),
    [emptyRowsCount, columns, isMobile]
  );

  return <>{emptyRows}</>;
}

export default EmptyRows;
