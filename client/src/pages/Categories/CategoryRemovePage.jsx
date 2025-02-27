import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchCategoryByUuidQuery,
  useRemoveCategoryMutation,
} from '../../store/services';

import ConfirmModal from '../../components/ModalWindow/ConfirmModal';

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

  return (
    <ConfirmModal
      isOpen
      error={error?.data}
      isFetching={isFetching}
      isLoading={isRemoving}
      message={`Ви впевнені, що хочете видалити категорію «${title}»?`}
      title='Видалення категорії...'
      onClose={handleModalClose}
      onConfirm={handleRemoveCategory}
    />
  );
}

export default CategoryRemovePage;
