import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useEditProductMutation,
  useFetchProductByUuidQuery,
} from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ProductEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const [editProduct, { isLoading: isSubmitting, error: submitError }] =
    useEditProductMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitProduct = useCallback(
    async (values) => {
      const response = await editProduct({ productUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editProduct, handleModalClose, uuid]
  );

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
      title='Редагування товару/послуги'
      onClose={handleModalClose}
    >
      {isFetching ? (
        <Preloader />
      ) : (
        <ProductForm
          isSubmitting={isSubmitting}
          product={product}
          onSubmit={handleSubmitProduct}
        />
      )}
    </ModalWindow>
  );
}

export default ProductEditPage;
