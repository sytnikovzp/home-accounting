import { useMemo } from 'react';
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
// ==============================================================
import { BASE_URL } from '../../constants';
// ==============================================================
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskIcon from '@mui/icons-material/Task';
// ==============================================================
import {
  cellStyle,
  headCellStyle,
  stylesActionsBodyTableCell,
  stylesActionsHeadTableCell,
  stylesFormControl,
  stylesTableContainer,
  stylesTableRow,
  stylesTableTypography,
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
    rowsPerPageOptions = [6, 10, 25, 50],
  },
  sortModel,
  onSortModelChange,
  selectedStatus,
  onStatusChange,
  showStatusDropdown = false,
  usersPage = false,
  linkEntity = '',
  isModerationPage = false,
}) {
  const handleSort = (field) => {
    const newSortModel =
      sortModel.field === field
        ? { field, order: sortModel.order === 'asc' ? 'desc' : 'asc' }
        : { field, order: 'asc' };
    onSortModelChange(newSortModel);
  };

  const handleStatusChange = (event) => {
    onStatusChange(event);
    onPageChange(1);
  };

  const isMobile = useMediaQuery('(max-width:600px)');
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedRows = useMemo(() => rows, [rows]);

  const renderTableCell = (col, row) => (
    <TableCell key={col.field} align={col.align || 'center'} sx={cellStyle}>
      {['logo', 'photo'].includes(col.field) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={
              row[col.field]
                ? `${BASE_URL.replace('/api/', '')}/images/${
                    col.field === 'logo' ? 'shops' : 'users'
                  }/${row[col.field]}`
                : col.field === 'logo'
                ? `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
                : undefined
            }
            alt={col.field === 'logo' ? 'Логотип магазину' : 'Фото користувача'}
            variant='rounded'
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      ) : col.field === 'title' && isModerationPage ? (
        <Typography variant='body1' sx={{ color: 'common.black' }}>
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
        <Typography variant='body1' sx={{ color: 'common.black' }}>
          {row[col.field]}
        </Typography>
      )}
    </TableCell>
  );

  return (
    <TableContainer sx={stylesTableContainer}>
      <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'success.main' }}>
            {memoizedColumns.map((col, index) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  ...headCellStyle,
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
                          <TaskIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title='Редагувати'>
                          <IconButton onClick={() => onEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Видалити'>
                          <IconButton onClick={() => onDelete(row)}>
                            <DeleteIcon />
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
        </TableBody>
      </Table>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        alignItems='center'
        m={2}
      >
        {showStatusDropdown && !usersPage && (
          <FormControl sx={stylesFormControl}>
            <InputLabel id='status-select-label'>Статус</InputLabel>
            <Select
              labelId='status-select-label'
              value={selectedStatus}
              label='Статус'
              size='small'
              onChange={handleStatusChange}
            >
              <MenuItem value='pending'>Очікує модерації</MenuItem>
              <MenuItem value='approved'>Затверджено</MenuItem>
              <MenuItem value='rejected'>Відхилено</MenuItem>
            </Select>
          </FormControl>
        )}
        {showStatusDropdown && usersPage && (
          <FormControl sx={stylesFormControl}>
            <InputLabel id='status-select-label'>Статус</InputLabel>
            <Select
              labelId='status-select-label'
              value={selectedStatus}
              label='Статус'
              size='small'
              onChange={handleStatusChange}
            >
              <MenuItem value='all'>Всі користувачі</MenuItem>
              <MenuItem value='pending'>Очікують веріфікації</MenuItem>
              <MenuItem value='verified'>Веріфіковані</MenuItem>
            </Select>
          </FormControl>
        )}
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
