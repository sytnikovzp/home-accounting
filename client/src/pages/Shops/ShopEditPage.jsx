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
  const { uuid } = useParams();
  const {
    entity: shopToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Shop');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitShop = async (values) => {
    setCrudError(null);
    try {
      await restController.editShop(
        shopToCRUD.uuid,
        values.title,
        values.description,
        values.url
      );
      handleModalClose();
      fetchShops();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleUploadLogo = async (file) => {
    setCrudError(null);
    try {
      await restController.uploadShopLogo(shopToCRUD.uuid, file);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleRemoveLogo = async () => {
    setCrudError(null);
    try {
      await restController.removeShopLogo(shopToCRUD.uuid);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
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
          <ShopForm
            shop={shopToCRUD}
            onSubmit={handleSubmitShop}
            onUploadLogo={handleUploadLogo}
            onRemoveLogo={handleRemoveLogo}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default ShopEditPage;
