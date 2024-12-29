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
  establishments,
  measures,
  currencies,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: purchaseToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Purchase');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitPurchase = async (values) => {
    setCrudError(null);
    try {
      await restController.editPurchase(
        purchaseToCRUD.uuid,
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
      title='Редагування витрати...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <PurchaseForm
            purchase={purchaseToCRUD}
            onSubmit={handleSubmitPurchase}
            products={products}
            establishments={establishments}
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
