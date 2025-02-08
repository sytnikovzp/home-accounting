import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  useFetchProductByUuidQuery,
  useRemoveProductMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

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

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveProduct = useCallback(async () => {
    const result = await removeProduct(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeProduct]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveProduct}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveProduct]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити товар/послугу «{title}»? Це призведе до
        видалення всіх витрат, що містять цей товар.
      </Typography>
    );
  }, [isFetching, title]);

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
