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
import { Edit, Delete, Task } from '@mui/icons-material';
// ==============================================================
import { BASE_URL } from '../../constants';
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
    <TableCell
      key={col.field}
      align={col.align || 'center'}
      sx={{
        borderRight: '1px solid #ccc',
        padding: '8px 16px',
        borderBottom: '1px solid #ccc',
      }}
    >
      {['logo', 'photo'].includes(col.field) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            sx={{
              fontSize: '0.875rem',
              color: 'common.black',
              padding: '5px 10px',
              borderRadius: '5px',
              boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
            }}
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
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        mb: 2,
      }}
    >
      <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'success.main' }}>
            {memoizedColumns.map((col, index) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  fontWeight: 'bold',
                  color: 'common.white',
                  borderBottom: '1px solid #ccc',
                  cursor: 'pointer',
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
                sx={{
                  fontWeight: 'bold',
                  color: 'common.white',
                  borderLeft: '1px solid darkgreen',
                  borderBottom: '1px solid #ccc',
                }}
              >
                {isModerationPage ? 'Модерувати' : 'Редаг./Видал.'}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {memoizedRows.length > 0 ? (
            memoizedRows.map((row) => (
              <TableRow
                key={row.uuid}
                sx={{
                  '&:nth-of-type(2n)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' },
                }}
              >
                {memoizedColumns.map((col, index) =>
                  renderTableCell(col, row, index)
                )}
                {!isMobile && (
                  <TableCell
                    align='center'
                    sx={{
                      padding: '8px 16px',
                      borderBottom: '1px solid #ccc',
                      borderLeft: '1px solid #ccc',
                      width: '140px',
                    }}
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
              <TableRow key={`empty-row-${index}`} sx={{ height: 57 }}>
                {memoizedColumns.map((col, colIndex) => (
                  <TableCell
                    key={`empty-cell-${index}-${colIndex}`}
                    sx={{ borderBottom: 'none' }}
                  />
                ))}
                {!isMobile && <TableCell sx={{ borderBottom: 'none' }} />}
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
        {showStatusDropdown && !usersPage && !expensesPage && (
          <FormControl
            sx={{
              flexGrow: 1,
              minWidth: 120,
              maxWidth: '365px',
            }}
          >
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
          <FormControl
            sx={{
              flexGrow: 1,
              minWidth: 120,
              maxWidth: '365px',
            }}
          >
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
        {showStatusDropdown && expensesPage && (
          <FormControl
            sx={{
              flexGrow: 1,
              minWidth: 120,
              maxWidth: '365px',
            }}
          >
            <InputLabel id='period-select-label'>Період</InputLabel>
            <Select
              labelId='period-select-label'
              value={selectedStatus}
              label='Період'
              size='small'
              onChange={handleStatusChange}
            >
              <MenuItem value='day'>За день</MenuItem>
              <MenuItem value='week'>За неділю</MenuItem>
              <MenuItem value='month'>За місяць</MenuItem>
              <MenuItem value='year'>За рік</MenuItem>
              <MenuItem value='allTime'>За весь час</MenuItem>
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
