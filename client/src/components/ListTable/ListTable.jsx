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
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { COLUMNS_CONFIG } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useHasPermission from '../../hooks/useHasPermission';

import Error from '../Error/Error';

import ActionColumns from './ActionColumns';
import EmptyRows from './EmptyRows';
import EntityTableCell from './EntityTableCell';
import StatusDropdown from './StatusDropdown';

import {
  stylesListTableActionsHeadTableCellModeration,
  stylesListTableActionsHeadTableCellNotModeration,
  stylesListTableContainer,
  stylesListTableContainerBox,
  stylesListTableError,
  stylesListTableExpensesSum,
  stylesListTablePreloader,
  stylesListTableTableHeadTableRow,
  stylesListTableTableRow,
} from '../../styles';

function ListTable({
  showStatusDropdown = false,
  fetchError,
  isFetching,
  linkEntity = '',
  pagination = {},
  rows,
  selectedStatus,
  sortModel,
  totalSumForPeriod,
  onEdit,
  onRemove,
  onModerate,
  onSortModelChange,
  onStatusChange,
}) {
  const columns = useMemo(() => COLUMNS_CONFIG[linkEntity] || [], [linkEntity]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isPreloaderVisible = useDelayedPreloader(isFetching);
  const { hasPermission } = useHasPermission();

  const totalCount = pagination?.totalCount ?? 0;

  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    pageSize,
    rowsPerPageOptions,
  } = pagination || {};

  const handleSortClick = useCallback(
    (field) => () => {
      const isSameField = sortModel.field === field;
      const newOrder =
        isSameField && sortModel.order === 'asc' ? 'desc' : 'asc';
      onSortModelChange({ field, order: newOrder });
    },
    [onSortModelChange, sortModel]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      onPageChange(page + 1);
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      onRowsPerPageChange(parseInt(event.target.value));
    },
    [onRowsPerPageChange]
  );

  const tableSx = useMemo(
    () => ({
      width: '100%',
      opacity: fetchError ? 0 : 1,
      borderCollapse: 'collapse',
    }),
    [fetchError]
  );

  const getTableCellSx = (field, index) => ({
    width: ['logo', 'photo'].includes(field) ? '90px' : 'auto',
    borderRight: index < columns.length - 1 ? '1px solid darkgreen' : 'none',
    borderBottom: '1px solid #ccc',
    fontWeight: 'bold',
    color: 'common.white',
    cursor: 'pointer',
  });

  const tablePaginationSx = useMemo(
    () => ({
      '& .MuiTablePagination-toolbar': {
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      },
    }),
    [isMobile]
  );

  return (
    <TableContainer sx={stylesListTableContainer}>
      <Box sx={stylesListTableContainerBox}>
        {isPreloaderVisible && (
          <Box sx={stylesListTablePreloader}>
            <CircularProgress color='success' size='3rem' />
          </Box>
        )}

        {fetchError && (
          <Box sx={stylesListTableError}>
            <Error message={fetchError?.data?.message} />
          </Box>
        )}

        <Table sx={tableSx}>
          <TableHead>
            <TableRow sx={stylesListTableTableHeadTableRow}>
              {columns.map(({ field, align = 'center', headerName }, index) => (
                <TableCell
                  key={field}
                  align={align}
                  sx={getTableCellSx(field, index)}
                  onClick={handleSortClick(field)}
                >
                  {headerName}
                  {sortModel.field === field &&
                    (sortModel.order === 'asc' ? ' ↑' : ' ↓')}
                </TableCell>
              ))}

              {linkEntity === 'moderation' && (
                <TableCell
                  align='center'
                  sx={stylesListTableActionsHeadTableCellModeration}
                >
                  Модерувати
                </TableCell>
              )}

              {linkEntity !== 'moderation' &&
                hasPermission(linkEntity, 'edit') && (
                  <TableCell
                    align='center'
                    sx={stylesListTableActionsHeadTableCellNotModeration}
                  >
                    Редаг.
                  </TableCell>
                )}

              {linkEntity !== 'moderation' &&
                hasPermission(linkEntity, 'remove') && (
                  <TableCell
                    align='center'
                    sx={stylesListTableActionsHeadTableCellNotModeration}
                  >
                    Видал.
                  </TableCell>
                )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.uuid} sx={stylesListTableTableRow}>
                {columns.map((col) => (
                  <EntityTableCell
                    key={col.field}
                    col={col}
                    linkEntity={linkEntity}
                    row={row}
                  />
                ))}

                {linkEntity === 'moderation' ? (
                  <ActionColumns
                    linkEntity={linkEntity}
                    row={row}
                    onModerate={onModerate}
                  />
                ) : (
                  <ActionColumns
                    linkEntity={linkEntity}
                    row={row}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                )}
              </TableRow>
            ))}
            <EmptyRows columns={columns} pageSize={pageSize} rows={rows} />
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
        {linkEntity === 'expenses' && (
          <Typography sx={stylesListTableExpensesSum} variant='body2'>
            Загальна сума: {totalSumForPeriod} UAH
          </Typography>
        )}
        <TablePagination
          component='div'
          count={totalCount}
          page={currentPage - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={tablePaginationSx}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </TableContainer>
  );
}

export default ListTable;
