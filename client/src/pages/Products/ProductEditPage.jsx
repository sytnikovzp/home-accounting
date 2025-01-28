import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditProductMutation,
  useFetchAllCategoriesQuery,
  useFetchProductByUuidQuery,
} from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ProductEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const queries = [
    useFetchProductByUuidQuery(uuid),
    useFetchAllCategoriesQuery({ page: 1, limit: 500 }),
  ];

  const product = queries[0]?.data;

  const isFetching = queries.some(({ isLoading }) => isLoading);

  const [editProduct, { isLoading, error }] = useEditProductMutation();

  const handleSubmitProduct = useCallback(
    async (values) => {
      const result = await editProduct({
        productUuid: uuid,
        ...values,
      });
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
      categories={queries[1].data?.data || []}
      isLoading={isLoading}
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
