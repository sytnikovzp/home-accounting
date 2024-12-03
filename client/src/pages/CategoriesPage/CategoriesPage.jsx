import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import CategoryAddPage from './CategoryAddPage';
import CategoryEditPage from './CategoryEditPage';
import CategoryDeletePage from './CategoryDeletePage';
import CategoryViewPage from './CategoryViewPage';
// ==============================================================
import ListTable from '../../components/ListTable/ListTable';
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';

function CategoriesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [crudError, setCrudError] = useState(null);

  const handleModalClose = () => {
    setCrudError(null);
    navigate('/categories');
  };

  const openModal = (mode, id = null) => {
    navigate(id ? `${mode}/${id}` : mode);
  };

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        status: selectedStatus,
        ...sortModel,
      };
      const { data, totalCount } = await restController.fetchAllCategories(
        params
      );
      setCategories(data);
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
    fetchCategories();
  }, [fetchCategories]);

  const renderRoutes = () => (
    <Routes>
      <Route
        path='add'
        element={
          <CategoryAddPage
            handleModalClose={handleModalClose}
            fetchCategories={fetchCategories}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='edit/:id'
        element={
          <CategoryEditPage
            handleModalClose={handleModalClose}
            fetchCategories={fetchCategories}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path='delete/:id'
        element={
          <CategoryDeletePage
            handleModalClose={handleModalClose}
            fetchCategories={fetchCategories}
            crudError={crudError}
            setCrudError={setCrudError}
          />
        }
      />
      <Route
        path=':id'
        element={<CategoryViewPage handleModalClose={handleModalClose} />}
      />
    </Routes>
  );

  if (isLoading)
    return <Preloader message='Завантаження списку "Категорій"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Категорії</Typography>
        <Button
          variant='contained'
          color='success'
          size='small'
          onClick={() => openModal('add')}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'center' },
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        rows={categories}
        onEdit={(category) => openModal('edit', category.id)}
        onDelete={(category) => openModal('delete', category.id)}
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
        linkEntity='categories'
      />
      {renderRoutes()}
    </>
  );
}

export default CategoriesPage;
