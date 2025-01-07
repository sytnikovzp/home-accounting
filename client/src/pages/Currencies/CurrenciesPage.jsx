import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import { uuidPattern } from '../../utils/sharedFunctions';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import CurrencyAddPage from './CurrencyAddPage';
import CurrencyDeletePage from './CurrencyDeletePage';
import CurrencyEditPage from './CurrencyEditPage';
import CurrencyViewPage from './CurrencyViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function CurrenciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/currencies');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchCurrencies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } =
        await restController.fetchAllCurrencies(params);
      setCurrencies(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі валюти | Моя бухгалтерія',
      add: 'Додавання валюти | Моя бухгалтерія',
      edit: 'Редагування валюти | Моя бухгалтерія',
      delete: 'Видалення валюти | Моя бухгалтерія',
      default: 'Валюти | Моя бухгалтерія',
    }),
    []
  );

  useEffect(() => {
    const pathKey = Object.keys(pageTitles).find((key) =>
      location.pathname.includes(key)
    );
    const isUuid = uuidPattern.test(location.pathname);
    const isEditOrDelete =
      location.pathname.includes('edit') ||
      location.pathname.includes('delete');
    document.title =
      isUuid && !isEditOrDelete
        ? pageTitles.view
        : pageTitles[pathKey] || pageTitles.default;
  }, [location, pageTitles]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

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
          <CurrencyAddPage
            crudError={crudError}
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <CurrencyEditPage
            crudError={crudError}
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <CurrencyDeletePage
            crudError={crudError}
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<CurrencyViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Валют"...' />;
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
          Валюти
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={() => handleModalOpen('add')}
        >
          Додати валюту
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'title', headerName: 'Назва валюти', align: 'left' },
        ]}
        linkEntity='currencies'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={currencies}
        sortModel={sortModel}
        onDelete={(currency) => handleModalOpen('delete', currency.uuid)}
        onEdit={(currency) => handleModalOpen('edit', currency.uuid)}
        onSortModelChange={setSortModel}
      />
      {renderRoutes()}
    </>
  );
}

export default CurrenciesPage;
