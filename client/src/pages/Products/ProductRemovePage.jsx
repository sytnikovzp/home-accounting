import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow';

function ProductRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: productData,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const [removeProduct, { isLoading: isRemoving, error: removeError }] =
    useRemoveProductMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити товар/послугу «${productData?.title}»? Це
          призведе до видалення всіх витрат, що містять цей товар/послугу.`;

  const handleRemove = useCallback(async () => {
    const response = await removeProduct(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeProduct]);

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення товару/послуги'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default ProductRemovePage;
