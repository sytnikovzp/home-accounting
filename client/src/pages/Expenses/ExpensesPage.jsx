import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';

import {
  selectExpenses,
  selectExpensesError,
  selectExpensesIsLoading,
  selectTotalCount,
} from '../../store/selectors/expensesSelectors';
import { clearCurrent } from '../../store/slices/expensesSlice';
import { fetchExpenses } from '../../store/thunks/expensesThunks';

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

const { EXPENSES_TITLES } = pageTitles;
const EXPENSES_PAGES = [
  { path: 'add', Component: ExpenseAddPage },
  { path: 'edit/:uuid', Component: ExpenseEditPage },
  { path: 'remove/:uuid', Component: ExpenseRemovePage },
  { path: ':uuid', Component: ExpenseViewPage },
];

function ExpensesPage() {
  const [sortModel, setSortModel] = useState({ field: 'date', order: 'desc' });
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const expenses = useSelector(selectExpenses);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectExpensesIsLoading);
  const error = useSelector(selectExpensesError);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      ago: selectedPeriod,
      sort: sortModel.field,
      order: sortModel.order,
    }),
    [currentPage, pageSize, selectedPeriod, sortModel]
  );

  useEffect(() => {
    dispatch(fetchExpenses(fetchParams));
  }, [dispatch, fetchParams]);

  usePageTitle(location, EXPENSES_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    dispatch(clearCurrent());
    navigate('/expenses');
  }, [dispatch, navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (expense) => handleModalOpen('edit', expense.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (expense) => handleModalOpen('remove', expense.uuid),
    [handleModalOpen]
  );

  const handlePeriodChange = useCallback((event) => {
    setSelectedPeriod(event.target.value);
  }, []);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Покупок"...' />;
  }

  if (error) {
    return <Error error={error} />;
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
        expensesPage
        showStatusDropdown
        columns={[
          { field: 'date', headerName: 'Дата', align: 'left' },
          { field: 'product', headerName: 'Товар', align: 'left' },
          { field: 'establishment', headerName: 'Заклад', align: 'left' },
        ]}
        linkEntity='expenses'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        rows={expenses}
        selectedStatus={selectedPeriod}
        sortModel={sortModel}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
        onStatusChange={handlePeriodChange}
      />
      <EntityRoutes
        entityPages={EXPENSES_PAGES}
        fetchEntities={fetchExpenses}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default ExpensesPage;
