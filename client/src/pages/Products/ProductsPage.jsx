import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { pageTitles } from '../../constants';
import useDelayedPreloader from '../../hooks/useDelayedPreloader';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePageTitle from '../../hooks/usePageTitle';
import usePagination from '../../hooks/usePagination';
import { useFetchAllProductsQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import ProductAddPage from './ProductAddPage';
import ProductEditPage from './ProductEditPage';
import ProductRemovePage from './ProductRemovePage';
import ProductViewPage from './ProductViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

const { PRODUCTS_TITLES } = pageTitles;
const PRODUCTS_PAGES = [
  { path: 'add', Component: ProductAddPage },
  { path: 'edit/:uuid', Component: ProductEditPage },
  { path: 'remove/:uuid', Component: ProductRemovePage },
  { path: ':uuid', Component: ProductViewPage },
];

function ProductsPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: productsData,
    error: fetchError,
    isLoading,
  } = useFetchAllProductsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const products = productsData?.data || [];
  const totalCount = productsData?.totalCount || 0;

  usePageTitle(location, PRODUCTS_TITLES);

  const handleModalOpen = useCallback(
    (mode, uuid = null) => {
      navigate(uuid ? `${mode}/${uuid}` : mode);
    },
    [navigate]
  );

  const handleModalClose = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const handleAddClick = useCallback(() => {
    handleModalOpen('add');
  }, [handleModalOpen]);

  const handleEdit = useCallback(
    (product) => handleModalOpen('edit', product.uuid),
    [handleModalOpen]
  );

  const handleDelete = useCallback(
    (product) => handleModalOpen('remove', product.uuid),
    [handleModalOpen]
  );

  const handleStatusChange = useCallback((event) => {
    setSelectedStatus(event.target.value);
  }, []);

  const showPreloader = useDelayedPreloader(isLoading);

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Товарів та послуг"...' />;
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
          Товари та послуги
        </Typography>
        <Button
          color='success'
          sx={stylesEntityPageButton}
          variant='contained'
          onClick={handleAddClick}
        >
          Додати товар/послугу
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        columns={[
          { field: 'category', headerName: 'Категорія', align: 'left' },
          { field: 'title', headerName: 'Назва товару/послуги', align: 'left' },
        ]}
        linkEntity='products'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={products}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes
        entityPages={PRODUCTS_PAGES}
        handleModalClose={handleModalClose}
      />
    </>
  );
}

export default ProductsPage;
