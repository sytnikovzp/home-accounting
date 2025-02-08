import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { columnsConfig } from '../../constants';

import ActionButtons from './ActionButtons';
import EmptyRows from './EmptyRows';
import EntityTableCell from './EntityTableCell';
import StatusDropdown from './StatusDropdown';

import {
  stylesListTableActionsHeadTableCell,
  stylesListTableContainer,
  stylesListTableHeadBackgroundColor,
  stylesListTableHeadCell,
  stylesListTableTable,
  stylesListTableTableRow,
} from '../../styles';

const { COLUMNS_CONFIG } = columnsConfig;

function ListTable({
  linkEntity = '',
  onEdit,
  onModerate,
  onRemove,
  onSortModelChange,
  onStatusChange,
  pagination = {},
  rows,
  selectedStatus,
  showStatusDropdown = false,
  sortModel,
}) {
  const columns = COLUMNS_CONFIG[linkEntity] || [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    pageSize,
    rowsPerPageOptions = [],
    totalCount,
  } = pagination;

  const handleSortChange = useCallback(
    (field) => {
      const isSameField = sortModel.field === field;
      const newOrder =
        isSameField && sortModel.order === 'asc' ? 'desc' : 'asc';
      onSortModelChange({ field, order: newOrder });
    },
    [onSortModelChange, sortModel]
  );

  return (
    <TableContainer sx={stylesListTableContainer}>
      <Table sx={stylesListTableTable}>
        <TableHead>
          <TableRow sx={stylesListTableHeadBackgroundColor}>
            {columns.map(({ field, align = 'center', headerName }, index) => (
              <TableCell
                key={field}
                align={align}
                sx={{
                  ...stylesListTableHeadCell,
                  borderRight:
                    index < columns.length - 1 ? '1px solid darkgreen' : 'none',
                  width: ['logo', 'photo'].includes(field) ? '90px' : 'auto',
                }}
                onClick={() => handleSortChange(field)}
              >
                {headerName}
                {sortModel.field === field &&
                  (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
            ))}
            {!isMobile && (
              <TableCell
                align='center'
                sx={stylesListTableActionsHeadTableCell}
              >
                {linkEntity === 'moderation' ? 'Модерувати' : 'Редаг./Видал.'}
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.uuid} sx={stylesListTableTableRow}>
                {columns.map((col) => (
                  <EntityTableCell
                    key={col.field}
                    col={col}
                    linkEntity={linkEntity}
                    row={row}
                  />
                ))}
                {!isMobile && (
                  <ActionButtons
                    linkEntity={linkEntity}
                    row={row}
                    onEdit={onEdit}
                    onModerate={onModerate}
                    onRemove={onRemove}
                  />
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align='center' colSpan={columns.length + 1}>
                <Typography variant='body1'>
                  Немає даних для відображення
                </Typography>
              </TableCell>
            </TableRow>
          )}
          <EmptyRows
            columns={columns}
            isMobile={isMobile}
            pageSize={pageSize}
            rows={rows}
          />
        </TableBody>
      </Table>

      <Box
        alignItems='center'
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        m={2}
      >
        {showStatusDropdown && (
          <StatusDropdown
            linkEntity={linkEntity}
            selectedStatus={selectedStatus}
            onPageChange={onPageChange}
            onStatusChange={onStatusChange}
          />
        )}
        <TablePagination
          component='div'
          count={totalCount}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          page={currentPage - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{
            '& .MuiTablePagination-toolbar': {
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            },
          }}
          onPageChange={(event, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) =>
            onRowsPerPageChange(parseInt(event.target.value))
          }
        />
      </Box>
    </TableContainer>
  );
}

export default ListTable;
