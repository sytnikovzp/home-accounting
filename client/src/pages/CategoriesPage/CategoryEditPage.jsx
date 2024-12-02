import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';

function CategoryEditPage({
  handleModalClose,
  fetchCategories,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: categoryToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Category');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleSubmitCategory = async (values) => {
    try {
      await restController.editCategory(categoryToCRUD.id, values.title);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування категорії...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <CategoryForm
            category={categoryToCRUD}
            onSubmit={handleSubmitCategory}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default CategoryEditPage;
