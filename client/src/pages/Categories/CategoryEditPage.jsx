import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditCategoryMutation,
  useFetchCategoryByUuidQuery,
} from '../../store/services';

import CategoryForm from '../../components/Forms/CategoryForm/CategoryForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function CategoryEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: category,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const [editCategory, { isLoading: isSubmitting, error: submitError }] =
    useEditCategoryMutation();

  const error = fetchError || submitError;

  const handleSubmitCategory = useCallback(
    async (values) => {
      const result = await editCategory({ categoryUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editCategory, handleModalClose, uuid]
  );

  const content = (
    <CategoryForm
      category={category}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitCategory}
    />
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      isFetching={isFetching}
      title='Редагування категорії'
      onClose={handleModalClose}
    />
  );
}

export default CategoryEditPage;
