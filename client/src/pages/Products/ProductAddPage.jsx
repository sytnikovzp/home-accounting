import { useCallback } from 'react';

import { Alert, Box, Button } from '@mui/material';

import { useAddProductMutation } from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductAddPage({ handleModalClose }) {
  const [addProduct, { isLoading: isSubmitting, error: submitError }] =
    useAddProductMutation();

  const error = submitError?.data;

  const handleSubmitProduct = useCallback(
    async (values) => {
      const result = await addProduct(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addProduct, handleModalClose]
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
      title='Додавання товару/послуги'
      onClose={handleModalClose}
    >
      <ProductForm isSubmitting={isSubmitting} onSubmit={handleSubmitProduct} />
    </ModalWindow>
  );
}

export default ProductAddPage;
