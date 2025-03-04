import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

function ProductRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const { title } = product ?? {};

  const [removeProduct, { isLoading: isRemoving, error: removeError }] =
    useRemoveProductMutation();

  const error = fetchError || removeError;

  const handleRemoveProduct = useCallback(async () => {
    const result = await removeProduct(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeProduct]);

  const message = `Ви впевнені, що хочете видалити товар/послугу «${title}»?
    Це призведе до видалення всіх витрат, що містять цей товар/послугу.`;

  return (
    <DeleteConfirmModal
      error={error}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення товару/послуги'
      onClose={handleModalClose}
      onSubmit={handleRemoveProduct}
    />
  );
}

export default ProductRemovePage;
