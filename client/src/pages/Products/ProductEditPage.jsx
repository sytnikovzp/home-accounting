import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditProductMutation,
  useFetchProductByUuidQuery,
} from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ProductEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: productData,
    isFetching,
    error: fetchError,
  } = useFetchProductByUuidQuery(uuid, { skip: !uuid });

  const [editProduct, { isLoading: isSubmitting, error: submitError }] =
    useEditProductMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editProduct({ productUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editProduct, handleModalClose, uuid]
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
      isFetching={isFetching}
      title='Редагування товару/послуги'
      onClose={handleModalClose}
    >
      <ProductForm
        isSubmitting={isSubmitting}
        product={productData}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default ProductEditPage;
