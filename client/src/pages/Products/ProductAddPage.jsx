import { useCallback } from 'react';

import { useAddProductMutation } from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  if (submitError) {
    return (
      <InfoModal
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      title='Додавання товару/послуги'
      onClose={handleModalClose}
    />
  );
}

export default ProductAddPage;
