import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useItemsPerPage from '../../hooks/useItemsPerPage';
import usePagination from '../../hooks/usePagination';
// ==============================================================
import Preloader from '../../components/Preloader/Preloader';
import Error from '../../components/Error/Error';
import ListTable from '../../components/ListTable/ListTable';
import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoriesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });
  const [modalData, setModalData] = useState({ mode: null, data: null });
  const [crudError, setCrudError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setErrorMessage(error.response?.data?.errors?.[0]?.title);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel, selectedStatus]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (mode, data = null) => {
    setModalData({ mode, data });
    const path = mode === 'add' ? 'add' : `${mode}/${data?.id}`;
    navigate(path);
  };

  const handleModalClose = () => {
    setModalData({ mode: null, data: null });
    setCrudError(null);
    navigate('/categories');
  };

  const handleSubmitCategory = async (values) => {
    try {
      if (location.pathname.includes('/edit')) {
        await restController.editCategory(modalData.data.id, values.title);
      } else {
        await restController.addCategory(values.title);
      }
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response?.data?.errors?.[0]?.title);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await restController.removeCategory(modalData.data.id);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response?.data?.errors?.[0]?.title);
    }
  };

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
          onClick={() => openModal('add')}
        >
          Додати категорію
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'left' },
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        rows={categories}
        onEdit={(category) => openModal('edit', category)}
        onDelete={(category) => openModal('delete', category)}
        pagination={{
          totalCount,
          currentPage,
          pageSize,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
          rowsPerPageOptions: [itemsPerPage, 10, 25, 50],
        }}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        selectedStatus={selectedStatus}
        onStatusChange={(event) => setSelectedStatus(event.target.value)}
        showStatusDropdown
        linkEntity='categories'
      />
      <Routes>
        <Route
          path='add'
          element={
            <CustomModal
              isOpen
              onClose={handleModalClose}
              showCloseButton
              title='Додавання категорії...'
              content={<CategoryForm onSubmit={handleSubmitCategory} />}
              error={crudError}
            />
          }
        />
        <Route
          path='edit/:id'
          element={
            <CustomModal
              isOpen
              onClose={handleModalClose}
              showCloseButton
              title='Редагування категорії...'
              content={
                <CategoryForm
                  category={modalData.data}
                  onSubmit={handleSubmitCategory}
                />
              }
              error={crudError}
            />
          }
        />
        <Route
          path='delete/:id'
          element={
            <CustomModal
              isOpen
              onClose={handleModalClose}
              showCloseButton
              title='Видалення категорії...'
              content={
                <Typography
                  variant='body1'
                  sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
                >
                  Ви впевнені, що хочете видалити категорію "
                  {modalData.data?.title}"?
                </Typography>
              }
              actions={[
                <Button
                  key='delete'
                  variant='contained'
                  color='error'
                  size='large'
                  onClick={handleDeleteCategory}
                  fullWidth
                >
                  Видалити
                </Button>,
              ]}
              error={crudError}
            />
          }
        />
      </Routes>
    </>
  );
}

export default CategoriesPage;
