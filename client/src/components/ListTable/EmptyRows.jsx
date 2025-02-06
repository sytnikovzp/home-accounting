import { TableCell, TableRow } from '@mui/material';

import {
  stylesListTableBorderEmptyRow,
  stylesListTableHeightEmptyRow,
} from '../../styles';

function EmptyRows({ columns, rows, pageSize, isMobile }) {
  return (
    <>
      {Array.from({ length: Math.max(pageSize - rows.length, 0) }).map(
        (_, index) => (
          <TableRow
            key={`empty-row-${index}`}
            sx={stylesListTableHeightEmptyRow}
          >
            {columns.map((_, colIndex) => (
              <TableCell
                key={`empty-cell-${index}-${colIndex}`}
                sx={stylesListTableBorderEmptyRow}
              />
            ))}
            {!isMobile && <TableCell sx={stylesListTableBorderEmptyRow} />}
          </TableRow>
        )
      )}
    </>
  );
}

export default EmptyRows;
