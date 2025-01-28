import { useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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

import { configs } from '../../constants';

import {
  stylesListTableActionsBodyTableCell,
  stylesListTableActionsHeadTableCell,
  stylesListTableAvatarBox,
  stylesListTableAvatarSize,
  stylesListTableBorderEmptyRow,
  stylesListTableCell,
  stylesListTableContainer,
  stylesListTableFormControl,
  stylesListTableHeadBackgroundColor,
  stylesListTableHeadCell,
  stylesListTableHeightEmptyRow,
  stylesListTableTable,
  stylesListTableTableRow,
  stylesListTableTableTypography,
  stylesListTableTextColor,
} from '../../styles';

const { BASE_URL } = configs;

function ListTable({
  columns,
  rows,
  onEdit,
  onDelete,
  onModerate,
  pagination: {
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [6, 15, 20, 25],
  },
  sortModel,
  onSortModelChange,
  selectedStatus,
  onStatusChange,
  showStatusDropdown = false,
  usersPage = false,
  expensesPage = false,
  linkEntity = '',
  isModerationPage = false,
}) {
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);

  const renderTableCell = (col, row) => (
    <TableCell
      key={col.field}
      align={col.align || 'center'}
      sx={stylesListTableCell}
    >
      {(() => {
        if (['logo', 'photo'].includes(col.field)) {
          return (
            <Box sx={stylesListTableAvatarBox}>
              <Avatar
                alt={
                  col.field === 'logo' ? 'Логотип закладу' : 'Фото користувача'
                }
                src={(() => {
                  if (row[col.field]) {
                    return `${BASE_URL.replace('/api/', '')}/images/${
                      col.field === 'logo' ? 'establishments' : 'users'
                    }/${row[col.field]}`;
                  }
                  if (col.field === 'logo') {
                    return `${BASE_URL.replace('/api/', '')}/images/noLogo.png`;
                  }
                  return null;
                })()}
                sx={stylesListTableAvatarSize}
                variant='rounded'
              />
            </Box>
          );
        }
        if (col.field === 'title' && isModerationPage) {
          return (
            <Typography sx={stylesListTableTextColor} variant='body1'>
              {row[col.field]}
            </Typography>
          );
        }
        if (['title', 'product', 'fullName'].includes(col.field)) {
          return (
            <RouterLink
              style={{ textDecoration: 'none' }}
              to={`/${linkEntity}/${row.uuid}`}
            >
              <Typography
                component='span'
                sx={stylesListTableTableTypography}
                variant='body1'
              >
                {row[col.field]}
              </Typography>
            </RouterLink>
          );
        }
        return (
          <Typography sx={stylesListTableTextColor} variant='body1'>
            {row[col.field]}
          </Typography>
        );
      })()}
    </TableCell>
  );

  const renderStatusDropdown = () => {
    let statusOptions = [];
    if (usersPage) {
      statusOptions = [
        { value: 'all', label: 'Всі користувачі' },
        { value: 'pending', label: 'Очікують веріфікації' },
        { value: 'verified', label: 'Веріфіковані' },
      ];
    } else if (expensesPage) {
      statusOptions = [
        { value: 'day', label: 'За останній день' },
        { value: 'week', label: 'За останній тиждень' },
        { value: 'month', label: 'За останній місяць' },
        { value: 'year', label: 'За останній рік' },
        { value: 'allTime', label: 'За весь час' },
      ];
    } else {
      statusOptions = [
        { value: 'pending', label: 'Очікує модерації' },
        { value: 'approved', label: 'Затверджено' },
        { value: 'rejected', label: 'Відхилено' },
      ];
    }

    return (
      <FormControl sx={stylesListTableFormControl}>
        <InputLabel id='status-select-label'>Статус</InputLabel>
        <Select
          label='Статус'
          labelId='status-select-label'
          size='small'
          value={selectedStatus}
          onChange={(e) => {
            onStatusChange(e);
            onPageChange(1);
          }}
        >
          {statusOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

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
                {memoizedColumns.map((col, index) =>
                  renderTableCell(col, row, index)
                )}
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
                          <IconButton onClick={() => onDelete(row)}>
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
        {showStatusDropdown && renderStatusDropdown()}
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
