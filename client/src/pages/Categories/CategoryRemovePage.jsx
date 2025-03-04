import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

function CategoryRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: category,
    isFetching,
    error: fetchError,
  } = useFetchCategoryByUuidQuery(uuid, { skip: !uuid });

  const { title } = category ?? {};

  const [removeCategory, { isLoading: isRemoving, error: removeError }] =
    useRemoveCategoryMutation();

  const error = fetchError || removeError;

  const handleRemoveCategory = useCallback(async () => {
    const result = await removeCategory(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeCategory]);

  const message = `Ви впевнені, що хочете видалити категорію «${title}»?`;

  return (
    <DeleteConfirmModal
      error={error}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення категорії'
      onClose={handleModalClose}
      onSubmit={handleRemoveCategory}
    />
  );
}

export default CategoryRemovePage;
