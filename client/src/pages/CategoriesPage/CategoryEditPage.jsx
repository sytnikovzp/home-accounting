import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoryEditPage({
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

  console.log(categoryToCRUD);

  useEffect(() => {
    if (id) {
      fetchCategoryById(id);
    }
  }, [id, fetchCategoryById]);

  const handleSubmitCategory = async (values) => {
    try {
      await restController.editCategory(categoryToCRUD.id, values.title);
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
      title='Редагування категорії...'
      content={
        <CategoryForm
          category={categoryToCRUD}
          onSubmit={handleSubmitCategory}
        />
      }
      error={crudError}
    />
  );
}

export default CategoryEditPage;
