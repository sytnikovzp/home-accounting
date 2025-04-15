import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const [removeProduct, { isLoading: isRemoving, error: removeError }] =
    useRemoveProductMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveProduct = useCallback(async () => {
    const response = await removeProduct(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeProduct]);

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      actionsOnRight={
        <>
          <Button color='default' variant='text' onClick={handleModalClose}>
            Скасувати
          </Button>
          <Button
            color='error'
            disabled={isRemoving || isFetching}
            variant='contained'
            onClick={handleRemoveProduct}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити товар/послугу «${product?.title}»? Це
          призведе до видалення всіх витрат, що містять цей товар/послугу.`}
      isFetching={isFetching}
      title='Видалення товару/послуги'
      onClose={handleModalClose}
    />
  );
}

export default ProductRemovePage;
