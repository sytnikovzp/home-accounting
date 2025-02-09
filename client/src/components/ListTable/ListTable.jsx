import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { columnsConfig } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';

import Error from '../../components/Error/Error';

import ActionButtons from './ActionButtons';
import EmptyRows from './EmptyRows';
import EntityTableCell from './EntityTableCell';
import StatusDropdown from './StatusDropdown';

import {
  stylesListTableActionsHeadTableCell,
  stylesListTableContainer,
  stylesListTableError,
  stylesListTablePreloader,
  stylesListTableTableRow,
} from '../../styles';

const { COLUMNS_CONFIG } = columnsConfig;

function ListTable({
  showStatusDropdown = false,
  fetchError,
  isFetching,
  linkEntity = '',
  pagination = {},
  rows,
  selectedStatus,
  sortModel,
  onEdit,
  onRemove,
  onModerate,
  onSortModelChange,
  onStatusChange,
}) {
  const columns = useMemo(() => COLUMNS_CONFIG[linkEntity] || [], [linkEntity]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isPreloaderVisible = useDelayedPreloader(isFetching);

  const totalCount = fetchError ? 0 : pagination?.totalCount;

  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    pageSize,
    rowsPerPageOptions = [],
  } = pagination || {};

  const memoizedSortModel = useMemo(() => sortModel, [sortModel]);

  const tableRows = useMemo(
    () =>
      rows.map((row) => (
        <TableRow key={row.uuid} sx={stylesListTableTableRow}>
          {columns.map((col) => (
            <EntityTableCell
              key={col.field}
              col={col}
              linkEntity={linkEntity}
              row={row}
            />
          ))}
          {!isMobile && (
            <ActionButtons
              linkEntity={linkEntity}
              row={row}
              onEdit={onEdit}
              onModerate={onModerate}
              onRemove={onRemove}
            />
          )}
        </TableRow>
      )),
    [rows, columns, linkEntity, isMobile, onEdit, onModerate, onRemove]
  );

  const handleSortChange = useCallback(
    (field) => {
      const isSameField = memoizedSortModel.field === field;
      const newOrder =
        isSameField && memoizedSortModel.order === 'asc' ? 'desc' : 'asc';
      onSortModelChange({ field, order: newOrder });
    },
    [onSortModelChange, memoizedSortModel]
  );

  return (
    <TableContainer sx={stylesListTableContainer}>
      <Box sx={{ position: 'relative' }}>
        {isPreloaderVisible && (
          <Box sx={stylesListTablePreloader}>
            <CircularProgress size='3rem' />
          </Box>
        )}

        {fetchError && (
          <Box sx={stylesListTableError}>
            <Error error={fetchError?.data?.message} />
          </Box>
        )}

        <Table
          sx={{
            borderCollapse: 'collapse',
            width: '100%',
            opacity: fetchError ? 0 : 1,
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'success.main' }}>
              {columns.map(({ field, align = 'center', headerName }, index) => (
                <TableCell
                  key={field}
                  align={align}
                  sx={{
                    borderBottom: '1px solid #ccc',
                    color: 'common.white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    borderRight:
                      index < columns.length - 1
                        ? '1px solid darkgreen'
                        : 'none',
                    width: ['logo', 'photo'].includes(field) ? '90px' : 'auto',
                  }}
                  onClick={() => handleSortChange(field)}
                >
                  {headerName}
                  {sortModel.field === field &&
                    (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
                </TableCell>
              ))}
              {!isMobile && (
                <TableCell
                  align='center'
                  sx={{
                    borderBottom: '1px solid #ccc',
                    borderLeft: '1px solid darkgreen',
                    color: 'common.white',
                    fontWeight: 'bold',
                    width: '150px',
                  }}
                >
                  {linkEntity === 'moderation' ? 'Модерувати' : 'Редаг./Видал.'}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
            <EmptyRows
              columns={columns}
              isMobile={isMobile}
              pageSize={pageSize}
              rows={rows}
            />
          </TableBody>
        </Table>
      </Box>

      <Box
        alignItems='center'
        display='flex'
        flexWrap='wrap'
        justifyContent={showStatusDropdown ? 'space-between' : 'flex-end'}
        m={2}
      >
        {showStatusDropdown && (
          <StatusDropdown
            linkEntity={linkEntity}
            selectedStatus={selectedStatus}
            onPageChange={onPageChange}
            onStatusChange={onStatusChange}
          />
        )}
        <TablePagination
          component='div'
          count={totalCount}
          page={currentPage - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
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
