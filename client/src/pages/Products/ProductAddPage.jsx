import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddProductMutation } from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductAddPage({ handleModalClose }) {
  const [addProduct, { isLoading: isSubmitting, error: submitError }] =
    useAddProductMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addProduct(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addProduct, handleModalClose]
  );

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
      title='Додавання товару/послуги'
      onClose={handleModalClose}
    >
      <ProductForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default ProductAddPage;
