import { useCallback } from 'react';

import { useAddProductMutation } from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductAddPage({ handleModalClose }) {
  const [addProduct, { isLoading: isSubmitting, error: submitError }] =
    useAddProductMutation();

  const handleSubmitProduct = useCallback(
    async (values) => {
      const result = await addProduct(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addProduct, handleModalClose]
  );

  const content = (
    <ProductForm isSubmitting={isSubmitting} onSubmit={handleSubmitProduct} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання товару/послуги'
      onClose={handleModalClose}
    />
  );
}

export default ProductAddPage;
