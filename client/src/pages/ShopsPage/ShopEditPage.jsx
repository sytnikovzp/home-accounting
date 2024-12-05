import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';
import ShopForm from '../../components/Forms/ShopForm/ShopForm';

function ShopEditPage({
  handleModalClose,
  fetchShops,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: shopToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Shop');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleSubmitShop = async (values) => {
    try {
      await restController.editShop(
        shopToCRUD.id,
        values.title,
        values.description,
        values.url
      );
      handleModalClose();
      fetchShops();
    } catch (error) {
      setCrudError(
        error.response?.data?.errors?.[0]?.title || 'Помилка завантаження даних'
      );
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування магазину...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ShopForm shop={shopToCRUD} onSubmit={handleSubmitShop} />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default ShopEditPage;
