import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DELAY_SHOW_PRELOADER } from '../../constants';
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';

import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';

import CategoryAddPage from './CategoryAddPage';
import CategoryDeletePage from './CategoryDeletePage';
import CategoryEditPage from './CategoryEditPage';
import CategoryViewPage from './CategoryViewPage';

function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'title', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/categories');
  };

  const openModal = (mode, uuid = null) => {
    navigate(uuid ? `${mode}/${uuid}` : mode);
  };

  const fetchCategories = useCallback(async () => {
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
        await restController.fetchAllCategories(params);
      setCategories(data || []);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, sortModel]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
          <CategoryAddPage
            crudError={crudError}
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='add'
      />
      <Route
        element={
          <CategoryEditPage
            crudError={crudError}
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='edit/:uuid'
      />
      <Route
        element={
          <CategoryDeletePage
            crudError={crudError}
            fetchCategories={fetchCategories}
            handleModalClose={handleModalClose}
            setCrudError={setCrudError}
          />
        }
        path='delete/:uuid'
      />
      <Route
        element={<CategoryViewPage handleModalClose={handleModalClose} />}
        path=':uuid'
      />
    </Routes>
  );

  if (showPreloader)
    return <Preloader message='Завантаження списку "Категорій"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        mb={2}
      >
        <Typography variant='h6'>Категорії витрат</Typography>
        <Button
          color='success'
          size='small'
          variant='contained'
          onClick={() => openModal('add')}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        showStatusDropdown
        columns={[
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        linkEntity='categories'
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 15, 20, 25],
        }}
        rows={categories}
        selectedStatus={selectedStatus}
        sortModel={sortModel}
        onDelete={(category) => openModal('delete', category.uuid)}
        onEdit={(category) => openModal('edit', category.uuid)}
        onSortModelChange={setSortModel}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
      />
      {renderRoutes()}
    </>
  );
}

export default CategoriesPage;
