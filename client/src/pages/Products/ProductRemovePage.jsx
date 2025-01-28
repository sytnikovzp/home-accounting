import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function ProductRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: product, isLoading: isFetching } =
    useFetchProductByUuidQuery(uuid);

  const [removeProduct, { isLoading: isDeleting, error }] =
    useRemoveProductMutation();

  const handleDeleteProduct = useCallback(async () => {
    if (!product?.uuid) {
      return;
    }
    const result = await removeProduct(product.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [product?.uuid, handleModalClose, removeProduct]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isDeleting}
        size='large'
        variant='contained'
        onClick={handleDeleteProduct}
      >
        Видалити
      </Button>,
    ],
    [isDeleting, handleDeleteProduct]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити товар/послугу «{product?.title}»? Це
        призведе до видалення всіх витрат, що містять цей товар.
      </Typography>
    );
  }, [isFetching, product?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductRemovePage;
