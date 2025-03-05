import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditProductMutation,
  useFetchProductByUuidQuery,
} from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: product,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const [editProduct, { isLoading: isSubmitting, error: submitError }] =
    useEditProductMutation();

  const error = fetchError || submitError;

  const handleSubmitProduct = useCallback(
    async (values) => {
      const result = await editProduct({ productUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editProduct, handleModalClose, uuid]
  );

  const content = (
    <ProductForm
      isSubmitting={isSubmitting}
      product={product}
      onSubmit={handleSubmitProduct}
    />
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
    <ModalWindow
      isOpen
      content={content}
      isFetching={isFetching}
      title='Редагування товару/послуги'
      onClose={handleModalClose}
    />
  );
}

export default ProductEditPage;
