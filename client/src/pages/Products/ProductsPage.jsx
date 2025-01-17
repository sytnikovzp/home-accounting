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

import ProductAddPage from './ProductAddPage';
import ProductRemovePage from './ProductRemovePage';
import ProductEditPage from './ProductEditPage';
import ProductViewPage from './ProductViewPage';

import {
  stylesEntityPageBox,
  stylesEntityPageButton,
  stylesEntityPageTypography,
} from '../../styles';

function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/products');
  };

  const handleModalOpen = (mode, uuid = null) => {
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
      const { data, totalCount } =
        await restController.fetchAllProducts(params);
      setProducts(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  const pageTitles = useMemo(
    () => ({
      view: 'Деталі товару/послуги | Моя бухгалтерія',
      add: 'Додавання товару/послуги | Моя бухгалтерія',
      edit: 'Редагування товару/послуги | Моя бухгалтерія',
      delete: 'Видалення товару/послуги | Моя бухгалтерія',
      default: 'Товари та послуги | Моя бухгалтерія',
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
    let timeout = null;
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
          <ProductAddPage
            categories={categories}
            crudError={crudError}
            fetchProducts={fetchProducts}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <ProductEditPage
            categories={categories}
            crudError={crudError}
            fetchProducts={fetchProducts}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <ProductRemovePage
            crudError={crudError}
            fetchProducts={fetchProducts}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<ProductViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader) {
    return <Preloader message='Завантаження списку "Товарів та послуг"...' />;
  }
  if (errorMessage) {
    return <Error error={errorMessage} />;
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
          onClick={() => handleModalOpen('add')}
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
        onDelete={(product) => handleModalOpen('delete', product.uuid)}
        onEdit={(product) => handleModalOpen('edit', product.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      {renderRoutes()}
    </>
  );
}

export default ProductsPage;
