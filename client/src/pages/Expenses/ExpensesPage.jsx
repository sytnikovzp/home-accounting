import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '@/src/hooks/useHasPermission';
import useItemsPerPage from '@/src/hooks/useItemsPerPage';
import usePagination from '@/src/hooks/usePagination';

import { useFetchAllExpensesQuery } from '@/src/store/services';

import EntityRoutes from '@/src/components/EntityRoutes/EntityRoutes';
import ListTable from '@/src/components/ListTable/ListTable';

import ExpenseAddPage from '@/src/pages/Expenses/ExpenseAddPage';
import ExpenseEditPage from '@/src/pages/Expenses/ExpenseEditPage';
import ExpenseRemovePage from '@/src/pages/Expenses/ExpenseRemovePage';
import ExpenseViewPage from '@/src/pages/Expenses/ExpenseViewPage';

import { stylesEntityContainerSx, stylesEntityPagesBox } from '@/src/styles';

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

  const handleAdd = useCallback(() => {
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

  const handlePeriodChange = useCallback(
    (newStatus) => setSelectedPeriod(newStatus),
    []
  );

  const paginationConfig = useMemo(
    () => ({
      currentPage,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
      pageSize,
      rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
      totalCount,
    }),
    [
      currentPage,
      handlePageChange,
      handleRowsPerPageChange,
      pageSize,
      itemsPerPage,
      totalCount,
    ]
  );

  return (
    <Container maxWidth='lg' sx={stylesEntityContainerSx}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Витрати</Typography>
        {hasPermission('expenses', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAdd}
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
        pagination={paginationConfig}
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
