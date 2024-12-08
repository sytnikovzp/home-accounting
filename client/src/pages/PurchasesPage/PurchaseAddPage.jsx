import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import PurchaseForm from '../../components/Forms/PurchaseForm/PurchaseForm';

function PurchaseAddPage({
  handleModalClose,
  fetchPurchases,
  products,
  shops,
  measures,
  currencies,
  crudError,
  setCrudError,
}) {
  const handleSubmitPurchase = async (values) => {
    setCrudError(null);
    try {
      await restController.addPurchase(
        values.product,
        values.amount,
        values.price,
        values.shop,
        values.measure,
        values.currency
      );
      handleModalClose();
      fetchPurchases();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.message ||
          'Помилка завантаження даних'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання покупки...'
      content={
        <PurchaseForm
          onSubmit={handleSubmitPurchase}
          products={products}
          shops={shops}
          measures={measures}
          currencies={currencies}
        />
      }
      error={crudError}
    />
  );
}

export default PurchaseAddPage;
