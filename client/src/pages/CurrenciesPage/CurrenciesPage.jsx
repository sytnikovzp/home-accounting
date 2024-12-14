import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import CurrencyAddPage from './CurrencyAddPage';
import CurrencyEditPage from './CurrencyEditPage';
import CurrencyDeletePage from './CurrencyDeletePage';
import CurrencyViewPage from './CurrencyViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function CurrenciesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/currencies');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchCurrencies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllCurrencies(
        params
      );
      setCurrencies(data);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='add'
        element={
          <CurrencyAddPage
            handleModalClose={handleModalClose}
            fetchCurrencies={fetchCurrencies}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:uuid'
        element={
          <CurrencyEditPage
            handleModalClose={handleModalClose}
            fetchCurrencies={fetchCurrencies}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:uuid'
        element={
          <CurrencyDeletePage
            handleModalClose={handleModalClose}
            fetchCurrencies={fetchCurrencies}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':uuid'
        element={<CurrencyViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (isLoading) return <Preloader message='Завантаження списку "Валют"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Валюти</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати валюту
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва валюти', align: 'left' },
        ]}
        rows={currencies}
        onEdit={(currency) => openModal('edit', currency.uuid)}
        onDelete={(currency) => openModal('delete', currency.uuid)}
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
        linkEntity='currencies'
      />
      {renderRoutes()}
    </>
  );
}

export default CurrenciesPage;
