import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import PurchaseForm from '../../components/Forms/PurchaseForm/PurchaseForm';

function PurchaseAddPage({
  handleModalClose,
  fetchPurchases,
  products,
  establishments,
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
        values.quantity,
        values.unitPrice,
        values.establishment,
        values.measure,
        values.currency,
        values.date
      );
      handleModalClose();
      fetchPurchases();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання витрати...'
      content={
        <PurchaseForm
          onSubmit={handleSubmitPurchase}
          products={products}
          establishments={establishments}
          measures={measures}
          currencies={currencies}
        />
      }
      error={crudError}
    />
  );
}

export default PurchaseAddPage;
