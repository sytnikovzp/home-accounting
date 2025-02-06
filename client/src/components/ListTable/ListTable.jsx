import { useCallback, useMemo } from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Delete, Edit, Task } from '@mui/icons-material';

import EntityTableCell from './EntityTableCell';
import StatusDropdown from './StatusDropdown';

import {
  stylesListTableActionsBodyTableCell,
  stylesListTableActionsHeadTableCell,
  stylesListTableBorderEmptyRow,
  stylesListTableContainer,
  stylesListTableHeadBackgroundColor,
  stylesListTableHeadCell,
  stylesListTableHeightEmptyRow,
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

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);

  const handleSort = useCallback(
    (field) => {
      const newSortModel =
        sortModel.field === field
          ? { field, order: sortModel.order === 'asc' ? 'desc' : 'asc' }
          : { field, order: 'asc' };
      onSortModelChange(newSortModel);
    },
    [sortModel, onSortModelChange]
  );

  const renderStatusDropdown = useMemo(
    () =>
      showStatusDropdown && (
        <StatusDropdown
          expensesPage={expensesPage}
          selectedStatus={selectedStatus}
          usersPage={usersPage}
          onPageChange={onPageChange}
          onStatusChange={onStatusChange}
        />
      ),
    [
      showStatusDropdown,
      expensesPage,
      selectedStatus,
      usersPage,
      onPageChange,
      onStatusChange,
    ]
  );

  return (
    <TableContainer sx={stylesListTableContainer}>
      <Table sx={stylesListTableTable}>
        <TableHead>
          <TableRow sx={stylesListTableHeadBackgroundColor}>
            {memoizedColumns.map((col, index) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  ...stylesListTableHeadCell,
                  borderRight:
                    index < memoizedColumns.length - 1
                      ? '1px solid darkgreen'
                      : 'none',
                  width: ['logo', 'photo'].includes(col.field)
                    ? '90px'
                    : 'auto',
                }}
                onClick={() => handleSort(col.field)}
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
          {memoizedRows.length > 0 ? (
            memoizedRows.map((row) => (
              <TableRow key={row.uuid} sx={stylesListTableTableRow}>
                {memoizedColumns.map((col, index) => (
                  <EntityTableCell
                    key={col.field || index}
                    col={col}
                    isModerationPage={isModerationPage}
                    linkEntity={linkEntity}
                    row={row}
                  />
                ))}
                {!isMobile && (
                  <TableCell
                    align='center'
                    sx={stylesListTableActionsBodyTableCell}
                  >
                    {isModerationPage ? (
                      <Tooltip title='Модерувати'>
                        <IconButton onClick={() => onModerate(row)}>
                          <Task />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title='Редагувати'>
                          <IconButton onClick={() => onEdit(row)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Видалити'>
                          <IconButton onClick={() => onRemove(row)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align='center' colSpan={memoizedColumns.length + 1}>
                <Typography variant='body1'>
                  Немає даних для відображення
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {Array.from(
            { length: pageSize - memoizedRows.length },
            (_, index) => (
              <TableRow
                key={`empty-row-${index}`}
                sx={stylesListTableHeightEmptyRow}
              >
                {memoizedColumns.map((col, colIndex) => (
                  <TableCell
                    key={`empty-cell-${index}-${colIndex}`}
                    sx={stylesListTableBorderEmptyRow}
                  />
                ))}
                {!isMobile && <TableCell sx={stylesListTableBorderEmptyRow} />}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <Box
        alignItems='center'
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        m={2}
      >
        {renderStatusDropdown}
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
