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
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';

function CurrenciesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/currencies');
  };

  const openModal = (mode, id = null) => {
    navigate(id ? `${mode}/${id}` : mode);
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
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
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
        path='edit/:id'
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
        path='delete/:id'
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
        path=':id'
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
          { field: 'id', headerName: 'ID', align: 'center' },
          { field: 'title', headerName: 'Назва валюти', align: 'left' },
          { field: 'description', headerName: 'Опис валюти', align: 'left' },
        ]}
        rows={currencies}
        onEdit={(currency) => openModal('edit', currency.id)}
        onDelete={(currency) => openModal('delete', currency.id)}
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
