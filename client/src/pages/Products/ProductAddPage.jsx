import restController from '../../api/rest/restController';
// ==============================================================
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
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка виконання операції'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання товару...'
      content={
        <ProductForm onSubmit={handleSubmitProduct} categories={categories} />
      }
      error={crudError}
    />
  );
}

export default ProductAddPage;
