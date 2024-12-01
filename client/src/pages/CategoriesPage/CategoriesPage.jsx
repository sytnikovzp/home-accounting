import { useState, useEffect, useCallback } from 'react';
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

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [crudError, setCrudError] = useState(null);
  const [isErrorMode, setIsErrorMode] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [sortModel, setSortModel] = useState({ field: 'id', order: 'asc' });

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortModel.field,
        order: sortModel.order,
      };
      const { data, totalCount } = await restController.fetchAllCategories(
        params
      );
      setCategories(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Помилка завантаження списку "Категорій":', error);
      setErrorMessage('Помилка завантаження списку "Категорій"');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortModel]);

  useEffect(() => {
    fetchCategories();
  }, [sortModel, currentPage, pageSize, fetchCategories]);

  const handleSubmitCategory = async (values) => {
    try {
      if (categoryToEdit) {
        await restController.editCategory(categoryToEdit.id, values.title);
      } else {
        await restController.addCategory(values.title);
      }
      setAddModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(
        categoryToEdit
          ? 'Помилка редагування категорії:'
          : 'Помилка додавання категорії:',
        error
      );
      setCrudError(
        categoryToEdit
          ? 'Помилка редагування категорії. Недостатньо прав.'
          : 'Помилка додавання категорії. Недостатньо прав.'
      );
    }
  };

  const handleAddCategory = () => {
    setCrudError(null);
    setCategoryToEdit(null);
    setAddModalOpen(true);
  };

  const handleEdit = (category) => {
    setCrudError(null);
    setCategoryToEdit(category);
    setAddModalOpen(true);
    setIsErrorMode(false);
  };

  const handleDelete = (category) => {
    setCrudError(null);
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
    setIsErrorMode(false);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await restController.removeCategory(categoryToDelete.id);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        await fetchCategories();
      } catch (error) {
        console.error('Помилка видалення категорії. Недостатньо прав.', error);
        setCrudError('Помилка видалення категорії. Недостатньо прав.');
        setIsErrorMode(true);
        setDeleteModalOpen(true);
      }
    }
  };

  if (isLoading)
    return <Preloader message='Завантаження списку "Kатегорій"...' />;
  if (errorMessage) return <Error error={errorMessage} />;

  return (
    <div>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Категорії</Typography>
        <Button variant='contained' color='success' onClick={handleAddCategory}>
          Додати категорію
        </Button>
      </Box>
      <ListTable
        columns={[
          { field: 'id', headerName: 'ID', align: 'left' },
          { field: 'title', headerName: 'Назва категорії', align: 'left' },
        ]}
        rows={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
      />
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        showCloseButton={true}
        title={
          categoryToEdit ? 'Редагування категорії...' : 'Додавання категорії...'
        }
        content={
          <CategoryForm
            category={categoryToEdit}
            onSubmit={handleSubmitCategory}
          />
        }
        error={crudError}
      />
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        showCloseButton={true}
        title='Видалення категорії'
        content={
          <>
            <Typography
              variant='body1'
              sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
            >
              Ви впевнені, що хочете видалити категорію "
              {categoryToDelete?.title}"?
            </Typography>
          </>
        }
        actions={[
          <Button
            key='delete'
            variant='contained'
            color='error'
            size='large'
            onClick={handleConfirmDelete}
            fullWidth
          >
            Видалити
          </Button>,
        ]}
        error={crudError}
        isErrorMode={isErrorMode}
      />
    </div>
  );
}

export default CategoriesPage;
