import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';

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

function ListTable({
  columns,
  expensesPage = false,
  isModerationPage = false,
  linkEntity = '',
  onEdit,
  onModerate,
  onRemove,
  onSortModelChange,
  onStatusChange,
  pagination: {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    pageSize,
    rowsPerPageOptions = [6, 15, 20, 25],
    totalCount,
  },
  rows,
  selectedStatus,
  showStatusDropdown = false,
  sortModel,
  usersPage = false,
}) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <TableContainer sx={stylesListTableContainer}>
      <Table sx={stylesListTableTable}>
        <TableHead>
          <TableRow sx={stylesListTableHeadBackgroundColor}>
            {columns.map((col, index) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  ...stylesListTableHeadCell,
                  borderRight:
                    index < columns.length - 1 ? '1px solid darkgreen' : 'none',
                  width: ['logo', 'photo'].includes(col.field)
                    ? '90px'
                    : 'auto',
                }}
                onClick={() => {
                  const isSameField = sortModel.field === col.field;
                  const newOrder =
                    isSameField && sortModel.order === 'asc' ? 'desc' : 'asc';
                  onSortModelChange({ field: col.field, order: newOrder });
                }}
              >
                {col.headerName}
                {sortModel.field === col.field &&
                  (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
            ))}
            {!isMobile && (
              <TableCell
                align='center'
                sx={stylesListTableActionsHeadTableCell}
              >
                {isModerationPage ? 'Модерувати' : 'Редаг./Видал.'}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.uuid} sx={stylesListTableTableRow}>
                {columns.map((col, index) => (
                  <EntityTableCell
                    key={col.field || index}
                    col={col}
                    isModerationPage={isModerationPage}
                    linkEntity={linkEntity}
                    row={row}
                  />
                ))}
                {!isMobile && (
                  <ActionButtons
                    isModerationPage={isModerationPage}
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
            expensesPage={expensesPage}
            selectedStatus={selectedStatus}
            usersPage={usersPage}
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
          rowsPerPageOptions={isMobile ? [] : rowsPerPageOptions}
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
