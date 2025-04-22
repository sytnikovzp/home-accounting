import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '../../hooks/useHasPermission';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllCurrenciesQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import CurrencyAddPage from './CurrencyAddPage';
import CurrencyEditPage from './CurrencyEditPage';
import CurrencyRemovePage from './CurrencyRemovePage';
import CurrencyViewPage from './CurrencyViewPage';

import { stylesEntityPagesBox } from '../../styles';

const CURRENCIES_PAGES = [
  { path: 'add', Component: CurrencyAddPage },
  { path: 'edit/:uuid', Component: CurrencyEditPage },
  { path: 'remove/:uuid', Component: CurrencyRemovePage },
  { path: ':uuid', Component: CurrencyViewPage },
];

function CurrenciesPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const { hasPermission } = useHasPermission();
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: currenciesData,
    isFetching,
    error: fetchError,
  } = useFetchAllCurrenciesQuery({
    page: currentPage,
    limit: pageSize,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const currencies = currenciesData?.data ?? [];
  const totalCount = currenciesData?.totalCount ?? 0;

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAdd = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (currency) => handleModalOpen('edit', currency.uuid),
    [handleModalOpen]
  );

  const handleRemove = useCallback(
    (currency) => handleModalOpen('remove', currency.uuid),
    [handleModalOpen]
  );

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box sx={stylesEntityPagesBox}>
        <Typography variant='h6'>Валюти</Typography>
        {hasPermission('currencies', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAdd}
          >
            Додати
          </Button>
        )}
      </Box>
      <ListTable
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='currencies'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={currencies}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
      />
      <EntityRoutes
        entityPages={CURRENCIES_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default CurrenciesPage;
