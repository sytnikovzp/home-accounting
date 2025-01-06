import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import ExpenseAddPage from './ExpenseAddPage';
import ExpenseDeletePage from './ExpenseDeletePage';
import ExpenseEditPage from './ExpenseEditPage';
import ExpenseViewPage from './ExpenseViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function ExpensesPage() {
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

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

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
      const { data, totalCount } =
        await restController.fetchAllExpenses(params);
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
        element={
          <ExpenseAddPage
            crudError={crudError}
            currencies={currencies}
            establishments={establishments}
            fetchExpenses={fetchExpenses}
            handleModalClose={handleModalClose}
            measures={measures}
            products={products}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <ExpenseEditPage
            crudError={crudError}
            currencies={currencies}
            establishments={establishments}
            fetchExpenses={fetchExpenses}
            handleModalClose={handleModalClose}
            measures={measures}
            products={products}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <ExpenseDeletePage
            crudError={crudError}
            fetchExpenses={fetchExpenses}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<ExpenseViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Покупок"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

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
          onClick={() => openModal('add')}
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
        onDelete={(expense) => openModal('delete', expense.uuid)}
        onEdit={(expense) => openModal('edit', expense.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedPeriod(event.target.value)}
      />
      {renderRoutes()}
    </>
  );
}

export default ExpensesPage;
