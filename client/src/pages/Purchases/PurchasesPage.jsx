import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import PurchaseAddPage from './PurchaseAddPage';
import PurchaseEditPage from './PurchaseEditPage';
import PurchaseDeletePage from './PurchaseDeletePage';
import PurchaseViewPage from './PurchaseViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function PurchasesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'date', order: 'desc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/purchases');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllPurchases(
        params
      );
      setPurchases(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

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
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchShops = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllShops(params);
      setShops(data || []);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
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
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
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
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
    fetchShops();
    fetchMeasures();
    fetchCurrencies();
  }, [
    fetchCurrencies,
    fetchMeasures,
    fetchProducts,
    fetchPurchases,
    fetchShops,
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
          <PurchaseAddPage
            handleModalClose={handleModalClose}
            fetchPurchases={fetchPurchases}
            products={products}
            shops={shops}
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
          <PurchaseEditPage
            handleModalClose={handleModalClose}
            fetchPurchases={fetchPurchases}
            products={products}
            shops={shops}
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
          <PurchaseDeletePage
            handleModalClose={handleModalClose}
            fetchPurchases={fetchPurchases}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':uuid'
        element={<PurchaseViewPage handleModalClose={handleModalClose} />}
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
        <Typography variant='h6'>Покупки</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати покупку
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'date', headerName: 'Дата', align: 'left' },
          { field: 'product', headerName: 'Товар', align: 'left' },
          { field: 'shop', headerName: 'Магазин', align: 'left' },
        ]}
        rows={purchases}
        onEdit={(purchase) => openModal('edit', purchase.uuid)}
        onDelete={(purchase) => openModal('delete', purchase.uuid)}
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
        linkEntity='purchases'
      />
      {renderRoutes()}
    </>
  );
}

export default PurchasesPage;
