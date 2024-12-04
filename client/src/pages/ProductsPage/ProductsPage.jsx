import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import ProductAddPage from './ProductAddPage';
import ProductEditPage from './ProductEditPage';
import ProductDeletePage from './ProductDeletePage';
import ProductViewPage from './ProductViewPage';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';

function ProductsPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/products');
  };

  const openModal = (mode, id = null) => {
    navigate(id ? `${mode}/${id}` : mode);
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllProducts(
        params
      );
      setProducts(data);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='add'
        element={
          <ProductAddPage
            handleModalClose={handleModalClose}
            fetchProducts={fetchProducts}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:id'
        element={
          <ProductEditPage
            handleModalClose={handleModalClose}
            fetchProducts={fetchProducts}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:id'
        element={
          <ProductDeletePage
            handleModalClose={handleModalClose}
            fetchProducts={fetchProducts}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':id'
        element={<ProductViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (isLoading)
    return <Preloader message='Завантаження списку "Товарів"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Товари</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати товар
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'center' },
          { field: 'title', headerName: 'Назва товару', align: 'left' },
          { field: 'category', headerName: 'Категорія товару', align: 'left' },
        ]}
        rows={products}
        onEdit={(product) => openModal('edit', product.id)}
        onDelete={(product) => openModal('delete', product.id)}
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
        selectedStatus={selectedStatus}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
        showStatusDropdown
        linkEntity='products'
      />
      {renderRoutes()}
    </>
  );
}

export default ProductsPage;
