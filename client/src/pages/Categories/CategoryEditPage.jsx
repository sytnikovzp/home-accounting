import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: category, isLoading: isFetching } = useFetchCategoryByUuidQuery(
    uuid,
    { skip: !uuid }
  );

  const [editCategory, { isLoading: isSubmitting, error: submitError }] =
    useEditCategoryMutation();

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await editCategory({ categoryUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editCategory, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <CategoryForm
      category={category}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitCategory}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError?.data}
      title='Редагування категорії...'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
