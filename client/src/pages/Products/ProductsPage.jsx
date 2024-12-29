import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import { DELAY_SHOW_PRELOADER } from '../../constants';
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
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/products');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
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
      setProducts(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params = {
        page: 1,
        limit: 500,
      };
      const { data } = await restController.fetchAllCategories(params);
      setCategories(data || []);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchCategories, fetchProducts]);

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
          <ProductAddPage
            handleModalClose={handleModalClose}
            fetchProducts={fetchProducts}
            categories={categories}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:uuid'
        element={
          <ProductEditPage
            handleModalClose={handleModalClose}
            fetchProducts={fetchProducts}
            categories={categories}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:uuid'
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
        path=':uuid'
        element={<ProductViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Товарів та послуг"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Товари та послуги</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати товар/послугу
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'category', headerName: 'Категорія', align: 'left' },
          { field: 'title', headerName: 'Назва товару/послуги', align: 'left' },
        ]}
        rows={products}
        onEdit={(product) => openModal('edit', product.uuid)}
        onDelete={(product) => openModal('delete', product.uuid)}
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
