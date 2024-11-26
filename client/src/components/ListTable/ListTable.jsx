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

const ListTable = ({ columns, rows, onEdit, onDelete, pagination }) => {
  return (
    <TableContainer style={{ width: '100%' }}>
      <Table sx={{ 
        width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align || ''}
                sx={{ textAlign: col.align || 'center' }}
              >
                {col.headerName}
              </TableCell>
            ))}
            <TableCell align='center'>Редагування/Видалення</TableCell>
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
              <TableCell align='center'>
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
      {pagination && (
        <TablePagination
          component='div'
          count={pagination.totalCount}
          page={pagination.currentPage - 1}
          rowsPerPage={pagination.pageSize}
          onPageChange={(event, page) => pagination.onPageChange(page + 1)}
        />
      )}
    </TableContainer>
  );
};

export default ListTable;
