import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
}) => {
  return (
    <TableContainer style={{ width: '100%' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align || 'center'}
                sx={{ textAlign: col.align || 'center' }}
              >
                {col.headerName}
              </TableCell>
            ))}
            <TableCell align='right'>Редагування/Видалення</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align || 'center'}>
                  {row[col.field]}
                </TableCell>
              ))}
              <TableCell align='right'>
                <IconButton onClick={() => onEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(row)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </TableContainer>
  );
};

export default ListTable;
