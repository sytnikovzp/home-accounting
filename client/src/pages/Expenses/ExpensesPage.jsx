import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import ExpenseAddPage from './ExpenseAddPage';
import ExpenseEditPage from './ExpenseEditPage';
import ExpenseDeletePage from './ExpenseDeletePage';
import ExpenseViewPage from './ExpenseViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function ExpensesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [establishments, setEstablishments] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('allTime');
  const [sortModel, setSortModel] = useState({ field: 'date', order: 'desc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/expenses');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ago: selectedPeriod,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllExpenses(
        params
      );
      setExpenses(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedPeriod, sortModel]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllProducts(params);
      setProducts(data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEstablishments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllEstablishments(params);
      setEstablishments(data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMeasures = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllMeasures(params);
      setMeasures(data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrencies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllCurrencies(params);
      setCurrencies(data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchProducts();
    fetchEstablishments();
    fetchMeasures();
    fetchCurrencies();
  }, [
    fetchCurrencies,
    fetchMeasures,
    fetchProducts,
    fetchExpenses,
    fetchEstablishments,
  ]);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => setShowPreloader(true), DELAY_SHOW_PRELOADER);
    } else {
      setShowPreloader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='add'
        element={
          <ExpenseAddPage
            handleModalClose={handleModalClose}
            fetchExpenses={fetchExpenses}
            products={products}
            establishments={establishments}
            measures={measures}
            currencies={currencies}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:uuid'
        element={
          <ExpenseEditPage
            handleModalClose={handleModalClose}
            fetchExpenses={fetchExpenses}
            products={products}
            establishments={establishments}
            measures={measures}
            currencies={currencies}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:uuid'
        element={
          <ExpenseDeletePage
            handleModalClose={handleModalClose}
            fetchExpenses={fetchExpenses}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':uuid'
        element={<ExpenseViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Покупок"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Витрати</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати витрату
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'date', headerName: 'Дата', align: 'left' },
          { field: 'product', headerName: 'Товар', align: 'left' },
          { field: 'establishment', headerName: 'Заклад', align: 'left' },
        ]}
        rows={expenses}
        onEdit={(expense) => openModal('edit', expense.uuid)}
        onDelete={(expense) => openModal('delete', expense.uuid)}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        selectedStatus={selectedPeriod}
        onStatusChange={(event) => setSelectedPeriod(event.target.value)}
        showStatusDropdown
        expensesPage
        linkEntity='expenses'
      />
      {renderRoutes()}
    </>
  );
}

export default ExpensesPage;
