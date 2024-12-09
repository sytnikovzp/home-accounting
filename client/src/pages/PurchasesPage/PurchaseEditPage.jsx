import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import PurchaseForm from '../../components/Forms/PurchaseForm/PurchaseForm';

function PurchaseEditPage({
  handleModalClose,
  fetchPurchases,
  products,
  shops,
  measures,
  currencies,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: purchaseToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Purchase');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleSubmitPurchase = async (values) => {
    setCrudError(null);
    try {
      await restController.editPurchase(
        purchaseToCRUD.id,
        values.product,
        values.amount,
        values.price,
        values.shop,
        values.measure,
        values.currency,
        values.date
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
      title='Редагування покупки...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <PurchaseForm
            purchase={purchaseToCRUD}
            onSubmit={handleSubmitPurchase}
            products={products}
            shops={shops}
            measures={measures}
            currencies={currencies}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default PurchaseEditPage;
