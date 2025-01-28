import { useCallback } from 'react';

import {
  useAddProductMutation,
  useFetchAllCategoriesQuery,
} from '../../store/services';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ProductAddPage({ handleModalClose }) {
  const queries = [useFetchAllCategoriesQuery({ page: 1, limit: 500 })];

  const isFetching = queries.some(({ isLoading }) => isLoading);

  const [addProduct, { isLoading, error }] = useAddProductMutation();

  const handleSubmitProduct = useCallback(
    async (values) => {
      const result = await addProduct(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addProduct, handleModalClose]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ProductForm
      categories={queries[0].data?.data || []}
      isLoading={isLoading}
      onSubmit={handleSubmitProduct}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Додавання товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductAddPage;
