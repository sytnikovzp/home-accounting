import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

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

  const content = isFetching ? (
    <Preloader />
  ) : (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      Ви впевнені, що хочете видалити товар/послугу «{title}»? Це призведе до
      видалення всіх витрат, що містять цей товар/послугу.
    </Typography>
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
    <DeleteConfirmModal
      content={content}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      title='Видалення товару/послуги'
      onClose={handleModalClose}
      onSubmit={handleRemoveProduct}
    />
  );
}

export default ProductRemovePage;
