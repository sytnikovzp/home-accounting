import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import ProductForm from '../../components/Forms/ProductForm/ProductForm';

function ProductAddPage({
  handleModalClose,
  fetchProducts,
  categories,
  crudError,
  setCrudError,
}) {
  const handleSubmitProduct = async (values) => {
    setCrudError(null);
    try {
      await restController.addProduct(values.title, values.category);
      handleModalClose();
      fetchProducts();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        <ProductForm categories={categories} onSubmit={handleSubmitProduct} />
      }
      error={crudError}
      title='Додавання товару/послуги...'
      onClose={handleModalClose}
    />
  );
}

export default ProductAddPage;
