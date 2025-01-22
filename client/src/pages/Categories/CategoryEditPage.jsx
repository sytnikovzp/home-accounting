import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
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
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Category');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
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
    <ModalWindow
      isOpen
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
      error={error || crudError}
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
