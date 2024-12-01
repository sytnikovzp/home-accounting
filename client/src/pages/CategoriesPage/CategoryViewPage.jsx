import { Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';

function CategoryViewPage({ handleModalClose, crudError, setCrudError }) {
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

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Перегляд категорії...'
      content={
        <Typography variant='body1' sx={{ textAlign: 'justify', mt: 2, mb: 2 }}>
          Категорія: {categoryToCRUD?.title}
        </Typography>
      }
      error={crudError}
    />
  );
}

export default CategoryViewPage;
