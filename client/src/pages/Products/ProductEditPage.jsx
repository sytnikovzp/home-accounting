import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

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
    isLoading: isFetching,
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

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ProductForm
      isSubmitting={isSubmitting}
      product={product}
      onSubmit={handleSubmitProduct}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductEditPage;
