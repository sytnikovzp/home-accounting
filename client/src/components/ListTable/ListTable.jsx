import { useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { Edit, Delete, Task } from '@mui/icons-material';
// ==============================================================
import { BASE_URL } from '../../constants';
import {
  stylesCell,
  stylesHeadCell,
  stylesActionsBodyTableCell,
  stylesActionsHeadTableCell,
  stylesFormControl,
  stylesTableContainer,
  stylesTableRow,
  stylesTableTypography,
  stylesTableAvatarBox,
  stylesTableAvatarSize,
  stylesTableTextColor,
  stylesTable,
  stylesTableHeadBackgroundColor,
  stylesTableHeightEmptyRow,
  stylesTableBorderEmptyRow,
} from '../../styles/theme';

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
    <TableCell key={col.field} align={col.align || 'center'} sx={stylesCell}>
      {['logo', 'photo'].includes(col.field) ? (
        <Box sx={stylesTableAvatarBox}>
          <Avatar
            src={
              row[col.field]
                ? `${BASE_URL.replace('/api/', '')}/images/${
                    col.field === 'logo' ? 'establishments' : 'users'
                  }/${row[col.field]}`
                : col.field === 'logo'
                ? `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
                : undefined
            }
            alt={col.field === 'logo' ? 'Логотип закладу' : 'Фото користувача'}
            variant='rounded'
            sx={stylesTableAvatarSize}
          />
        </Box>
      ) : col.field === 'title' && isModerationPage ? (
        <Typography variant='body1' sx={stylesTableTextColor}>
          {row[col.field]}
        </Typography>
      ) : ['title', 'product', 'fullName'].includes(col.field) ? (
        <RouterLink
          to={`/${linkEntity}/${row.uuid}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant='body1'
            component='span'
            sx={stylesTableTypography}
          >
            {row[col.field]}
          </Typography>
        </RouterLink>
      ) : (
        <Typography variant='body1' sx={stylesTableTextColor}>
          {row[col.field]}
        </Typography>
      )}
    </TableCell>
  );

  const renderStatusDropdown = () => {
    const statusOptions = usersPage
      ? [
          { value: 'all', label: 'Всі користувачі' },
          { value: 'pending', label: 'Очікують веріфікації' },
          { value: 'verified', label: 'Веріфіковані' },
        ]
      : expensesPage
      ? [
          { value: 'day', label: 'За день' },
          { value: 'week', label: 'За неділю' },
          { value: 'month', label: 'За місяць' },
          { value: 'year', label: 'За рік' },
          { value: 'allTime', label: 'За весь час' },
        ]
      : [
          { value: 'pending', label: 'Очікує модерації' },
          { value: 'approved', label: 'Затверджено' },
          { value: 'rejected', label: 'Відхилено' },
        ];

    return (
      <FormControl sx={stylesFormControl}>
        <InputLabel id='status-select-label'>Статус</InputLabel>
        <Select
          labelId='status-select-label'
          value={selectedStatus}
          label='Статус'
          size='small'
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
    <TableContainer sx={stylesTableContainer}>
      <Table sx={stylesTable}>
        <TableHead>
          <TableRow sx={stylesTableHeadBackgroundColor}>
            {memoizedColumns.map((col, index) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  ...stylesHeadCell,
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
              <TableCell align='center' sx={stylesActionsHeadTableCell}>
                {isModerationPage ? 'Модерувати' : 'Редаг./Видал.'}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {memoizedRows.length > 0 ? (
            memoizedRows.map((row) => (
              <TableRow key={row.uuid} sx={stylesTableRow}>
                {memoizedColumns.map((col, index) =>
                  renderTableCell(col, row, index)
                )}
                {!isMobile && (
                  <TableCell align='center' sx={stylesActionsBodyTableCell}>
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
              <TableCell colSpan={memoizedColumns.length + 1} align='center'>
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
                sx={stylesTableHeightEmptyRow}
              >
                {memoizedColumns.map((col, colIndex) => (
                  <TableCell
                    key={`empty-cell-${index}-${colIndex}`}
                    sx={stylesTableBorderEmptyRow}
                  />
                ))}
                {!isMobile && <TableCell sx={stylesTableBorderEmptyRow} />}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        alignItems='center'
        m={2}
      >
        {showStatusDropdown && renderStatusDropdown()}
        <TablePagination
          component='div'
          count={totalCount}
          page={currentPage - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={isMobile ? [] : rowsPerPageOptions}
          onPageChange={(event, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) =>
            onRowsPerPageChange(parseInt(event.target.value))
          }
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          sx={{
            '& .MuiTablePagination-toolbar': {
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            },
          }}
        />
      </Box>
    </TableContainer>
  );
}

export default ListTable;
