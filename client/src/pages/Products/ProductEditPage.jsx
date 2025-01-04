import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import ProductForm from '../../components/Forms/ProductForm/ProductForm';
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
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування товару...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ProductForm
            product={productToCRUD}
            onSubmit={handleSubmitProduct}
            categories={categories}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default ProductEditPage;
