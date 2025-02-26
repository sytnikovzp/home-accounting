import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useHasPermission from '../../hooks/useHasPermission';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import { useFetchAllProductsQuery } from '../../store/services';

import EntityRoutes from '../../components/EntityRoutes/EntityRoutes';
import ListTable from '../../components/ListTable/ListTable';

import ProductAddPage from './ProductAddPage';
import ProductEditPage from './ProductEditPage';
import ProductRemovePage from './ProductRemovePage';
import ProductViewPage from './ProductViewPage';

const PRODUCTS_PAGES = [
  { path: 'add', Component: ProductAddPage },
  { path: 'edit/:uuid', Component: ProductEditPage },
  { path: 'remove/:uuid', Component: ProductRemovePage },
  { path: ':uuid', Component: ProductViewPage },
];

function ProductsPage() {
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const { hasPermission } = useHasPermission();
  const navigate = useNavigate();

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const {
    data: productsData,
    isFetching,
    error: fetchError,
  } = useFetchAllProductsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus,
    sort: sortModel.field,
    order: sortModel.order,
  });

  const products = productsData?.data ?? [];
  const totalCount = productsData?.totalCount ?? 0;

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

  const handleRemove = useCallback(
    (product) => handleModalOpen('remove', product.uuid),
    [handleModalOpen]
  );

  const handleStatusChange = (newStatus) => setSelectedStatus(newStatus);

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Товари та послуги</Typography>
        {hasPermission('products', 'add') && (
          <Button
            color='success'
            size='small'
            variant='contained'
            onClick={handleAddClick}
          >
            Додати
          </Button>
        )}
      </Box>
      <ListTable
        showStatusDropdown
        fetchError={fetchError}
        isFetching={isFetching}
        linkEntity='products'
        pagination={{
          currentPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          pageSize,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
          totalCount,
        }}
        rows={products}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSortModelChange={setSortModel}
        onStatusChange={handleStatusChange}
      />
      <EntityRoutes
        entityPages={PRODUCTS_PAGES}
        handleModalClose={handleModalClose}
      />
    </Container>
  );
}

export default ProductsPage;
