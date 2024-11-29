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
import DeleteConfirmation from '../../components/DeleteConfirmation/DeleteConfirmation';

function CategoriesPage() {
  const itemsPerPage = useItemsPerPage();
  const { currentPage, pageSize, handlePageChange, handleRowsPerPageChange } =
    usePagination(itemsPerPage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isErrorMode, setIsErrorMode] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, totalCount } = await restController.fetchAllCategories({
        page: currentPage,
        limit: pageSize,
      });
      setCategories(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Не вдалося отримати категорії:', error);
      setError('Не вдалося отримати категорії');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    console.log('Додавання нової категорії');
  };

  const handleEdit = (category) => {
    console.log('Edit:', category);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
    setIsErrorMode(false);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await restController.removeCategory(categoryToDelete.id);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        await fetchCategories();
      } catch (error) {
        console.error('Помилка при видаленні категорії:', error);
        setDeleteError('Не вдалося видалити категорію. Недостатньо прав.');
        setIsErrorMode(true);
        setDeleteModalOpen(true);
      }
    }
  };

  if (isLoading) return <Preloader message='Завантаження категорій...' />;
  if (error) return <Error error={error} />;

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
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        error={deleteError}
        isErrorMode={isErrorMode}
      />
    </div>
  );
}

export default CategoriesPage;
