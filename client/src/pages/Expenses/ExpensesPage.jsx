import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '../../hooks/useHasPermission';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllExpensesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import ExpenseAddPage from './ExpenseAddPage';
import ExpenseEditPage from './ExpenseEditPage';
import ExpenseRemovePage from './ExpenseRemovePage';
import ExpenseViewPage from './ExpenseViewPage';

import { stylesEntityPagesBox } from '../../styles';

const EXPENSES_PAGES = [
  { path: 'add', Component: ExpenseAddPage },
  { path: 'edit/:uuid', Component: ExpenseEditPage },
  { path: 'remove/:uuid', Component: ExpenseRemovePage },
  { path: ':uuid', Component: ExpenseViewPage },
];

function ExpensesPage() {
  const [sortModel, setSortModel] = useState({ field: 'date', order: 'desc' });
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');
  const { hasPermission } = useHasPermission();
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: expensesData,
    isFetching,
    error: fetchError,
  } = useFetchAllExpensesQuery({
    page: currentPage,
    limit: pageSize,
    ago: selectedPeriod,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const expenses = expensesData?.data ?? [];
  const totalCount = expensesData?.totalCount ?? 0;
  const totalSumForPeriod = expensesData?.totalSumForPeriod ?? 0;

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (expense) => handleModalOpen('edit', expense.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (expense) => handleModalOpen('remove', expense.uuid),
    [handleModalOpen]
  );

  const handlePeriodChange = (newStatus) => setSelectedPeriod(newStatus);

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Витрати</Typography>
        {hasPermission('expenses', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAddClick}
          >
            Додати
          </Button>
        )}
      </Box>
      <ListTable
        showStatusDropdown
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='expenses'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={expenses}
        selectedStatus={selectedPeriod}
        sortModel={sortModel}
        totalSumForPeriod={totalSumForPeriod}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handlePeriodChange}
      />
      <EntityRoutes
        entityPages={EXPENSES_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default ExpensesPage;
