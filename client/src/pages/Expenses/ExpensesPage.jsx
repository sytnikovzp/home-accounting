import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
import { useFetchAllExpensesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import ExpenseAddPage from './ExpenseAddPage';
import ExpenseEditPage from './ExpenseEditPage';
import ExpenseRemovePage from './ExpenseRemovePage';
import ExpenseViewPage from './ExpenseViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const EXPENSES_PAGES = [
  { path: 'add', Component: ExpenseAddPage },
  { path: 'edit/:uuid', Component: ExpenseEditPage },
  { path: 'remove/:uuid', Component: ExpenseRemovePage },
  { path: ':uuid', Component: ExpenseViewPage },
];

function ExpensesPage() {
  const [sortModel, setSortModel] = useState({ field: 'date', order: 'desc' });
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');
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

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/expenses');
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

  const handlePeriodChange = useCallback((event) => {
    setSelectedPeriod(event.target.value);
  }, []);

  const isPreloaderVisible = useDelayedPreloader(isFetching);

  if (isPreloaderVisible) {
    return <Preloader message='Завантаження списку "Покупок"...' />;
  }

  if (fetchError) {
    return <Error error={fetchError.data.message} />;
  }

  return (
    <>
      <Box
        alignItems='center'
        display='flex'
        flexDirection={stylesEntityPageBox}
        justifyContent='space-between'
        mb={2}
      >
        <Typography component='h2' sx={stylesEntityPageTypography}>
          Витрати
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
        >
          Додати витрату
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
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
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handlePeriodChange}
      />
      <EntityRoutes
        entityPages={EXPENSES_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default ExpensesPage;
