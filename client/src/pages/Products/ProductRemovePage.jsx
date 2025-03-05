import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button } from '@mui/material';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import ConfirmMessage from '../../components/ModalWindow/ConfirmMessage';
import ModalActions from '../../components/ModalWindow/ModalActions';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

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
    const result = await removeProduct(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeProduct]);

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      title='Видалення товару/послуги'
      onClose={handleModalClose}
    >
      {isFetching ? (
        <Preloader />
      ) : (
        <ConfirmMessage>
          Ви впевнені, що хочете видалити товар/послугу «{product?.title}»? Це
          призведе до видалення всіх витрат, що містять цей товар/послугу.
        </ConfirmMessage>
      )}
      <ModalActions>
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
      </ModalActions>
    </ModalWindow>
  );
}

export default ProductRemovePage;
