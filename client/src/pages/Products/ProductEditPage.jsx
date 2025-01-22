import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ProductForm from '../../components/Forms/ProductForm/ProductForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ProductEditPage({
  handleModalClose,
  fetchProducts,
  categories,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: productToCRUD,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitProduct = async (values) => {
    setCrudError(null);
    try {
      await restController.editProduct(
        productToCRUD.uuid,
        values.title,
        values.category
      );
      handleModalClose();
      fetchProducts();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ProductForm
            categories={categories}
            product={productToCRUD}
            onSubmit={handleSubmitProduct}
          />
        )
      }
      error={error || crudError}
      title='Редагування товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductEditPage;
