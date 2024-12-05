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

const ListTable = ({
  columns,
  rows,
  onEdit,
  onDelete,
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
  linkEntity = '',
}) => {
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

  const renderTableCell = (col, row, index) => (
    <TableCell key={col.field} align={col.align || 'center'} sx={cellStyle}>
      {col.field === 'logo' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={
              row[col.field]
                ? `${BASE_URL.replace('/api/', '')}/images/shops/${
                    row[col.field]
                  }`
                : `${BASE_URL.replace('/api/', '')}/images/noLogo.png`
            }
            alt='Логотип магазину'
            variant='rounded'
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      ) : index === 1 ? (
        <RouterLink
          to={`/${linkEntity}/${row.id}`}
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
                  width: col.field === 'id' ? '60px' : 'auto',
                }}
                onClick={() => handleSort(col.field)}
              >
                {col.headerName}
                {sortModel.field === col.field &&
                  (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
            ))}
            {!isMobile && (
              <TableCell align='right' sx={stylesActionsHeadTableCell}>
                Редаг./Видал.
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {memoizedRows.map((row) => (
            <TableRow key={row.id} sx={stylesTableRow}>
              {memoizedColumns.map((col, index) =>
                renderTableCell(col, row, index)
              )}
              {!isMobile && (
                <TableCell align='center' sx={stylesActionsBodyTableCell}>
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        alignItems='center'
        m={2}
      >
        {showStatusDropdown && (
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
};

export default ListTable;
