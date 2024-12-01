import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';

function CategoryDeletePage({
  handleModalClose,
  fetchCategories,
  crudError,
  setCrudError,
}) {
  const [categoryToCRUD, setCategoryToCRUD] = useState(null);

  const { id } = useParams();

  const fetchCategoryById = useCallback(
    async (categoryId) => {
      try {
        const categoryById = await restController.fetchCategoryById(categoryId);
        setCategoryToCRUD(categoryById);
      } catch (error) {
        setCrudError(error.response?.data?.errors?.[0]?.title);
      }
    },
    [setCrudError]
  );

  useEffect(() => {
    if (id) {
      fetchCategoryById(id);
    }
  }, [id, fetchCategoryById]);

  const handleDeleteCategory = async () => {
    try {
      await restController.removeCategory(categoryToCRUD.id);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(error.response?.data?.errors?.[0]?.title);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Видалення категорії...'
      content={
        <Typography variant='body1' sx={{ textAlign: 'justify', mt: 2, mb: 2 }}>
          Ви впевнені, що хочете видалити категорію "{categoryToCRUD?.title}"?
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
  );
}

export default CategoryDeletePage;
