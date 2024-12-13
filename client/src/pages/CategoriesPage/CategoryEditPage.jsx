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
  const { uuid } = useParams();
  const {
    entity: categoryToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Category');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitCategory = async (values) => {
    setCrudError(null);
    try {
      await restController.editCategory(categoryToCRUD.uuid, values.title);
      handleModalClose();
      fetchCategories();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
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
