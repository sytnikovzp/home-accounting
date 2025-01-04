import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import Preloader from '../../components/Preloader/Preloader';

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
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
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
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
