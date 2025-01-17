import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';

import { uuidPattern } from '../../utils/sharedFunctions';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import {
  selectCurrencies,
  selectError,
  selectIsLoading,
  selectTotalCount,
} from '../../store/selectors/currenciesSelectors';
import { clearCurrent } from '../../store/slices/currenciesSlice';
import { fetchCurrencies } from '../../store/thunks/currenciesThunks';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import CurrencyAddPage from './CurrencyAddPage';
import CurrencyEditPage from './CurrencyEditPage';
import CurrencyRemovePage from './CurrencyRemovePage';
import CurrencyViewPage from './CurrencyViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function CurrenciesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currencies = useSelector(selectCurrencies);
  const totalCount = useSelector(selectTotalCount);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const handleModalClose = () => {
    dispatch(clearCurrent());
    navigate('/currencies');
  };

  const handleModalOpen = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  useEffect(() => {
    dispatch(
      fetchCurrencies({
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      })
    );
  }, [currentPage, dispatch, pageSize, sortModel]);

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

  const showPreloader = useDelayedPreloader(isLoading);

  const renderRoutes = () => (
    <Routes>
      <Route
        element={
          <CurrencyAddPage
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
          />
        }
        path='add'
      />
      <Route
        element={
          <CurrencyEditPage
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <CurrencyRemovePage
            fetchCurrencies={fetchCurrencies}
            handleModalClose={handleModalClose}
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

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Валют"...' />;
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
