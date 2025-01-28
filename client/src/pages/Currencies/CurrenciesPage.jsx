import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllCurrenciesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
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

const { CURRENCIES_TITLES } = pageTitles;
const CURRENCIES_PAGES = [
  { path: 'add', Component: CurrencyAddPage },
  { path: 'edit/:uuid', Component: CurrencyEditPage },
  { path: 'remove/:uuid', Component: CurrencyRemovePage },
  { path: ':uuid', Component: CurrencyViewPage },
];

function CurrenciesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: currenciesData,
    error: fetchError,
    isLoading,
  } = useFetchAllCurrenciesQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const currencies = currenciesData?.data || [];
  const totalCount = currenciesData?.totalCount || 0;

  usePageTitle(location, CURRENCIES_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/currencies');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (currency) => handleModalOpen('edit', currency.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (currency) => handleModalOpen('remove', currency.uuid),
    [handleModalOpen]
  );

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Валют"...' />;
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
          Валюти
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={CURRENCIES_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default CurrenciesPage;
