import {
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
  Box,
  useMediaQuery,
} from '@mui/material';
// ==============================================================
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// ==============================================================
import {
  stylesHeadTableCellDesktop,
  stylesHeadTableCellMobile,
  stylesTableCell,
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
}) => {
  const handleSort = (field) => {
    const newSortModel =
      sortModel.field === field
        ? { field, order: sortModel.order === 'asc' ? 'desc' : 'asc' }
        : { field, order: 'asc' };
    onSortModelChange(newSortModel);
  };
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <TableContainer style={{ width: '100%', overflowX: 'auto' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{
                  textAlign: col.align || 'center',
                  ...stylesHeadTableCellDesktop,
                }}
                onClick={() => handleSort(col.field)}
              >
                {col.headerName}
                {sortModel.field === col.field &&
                  (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
            ))}
            {!isMobile && (
              <TableCell align='right' sx={stylesHeadTableCellMobile}>
                Редаг./Видал.
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || 'center'}
                  sx={stylesTableCell}
                >
                  {row[col.field]}
                </TableCell>
              ))}
              {!isMobile && (
                <TableCell align='right' sx={stylesTableCell}>
                  <IconButton onClick={() => onEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        display='flex'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        alignItems='center'
        m={2}
      >
        {showStatusDropdown && (
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id='status-select-label'>Статус</InputLabel>
            <Select
              labelId='status-select-label'
              value={selectedStatus}
              label='Статус'
              size='small'
              onChange={onStatusChange}
            >
              <MenuItem value='pending'>Очікується</MenuItem>
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
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={(event, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) =>
            onRowsPerPageChange(parseInt(event.target.value))
          }
        />
      </Box>
    </TableContainer>
  );
};

export default ListTable;
