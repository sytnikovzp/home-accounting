import restController from '../../api/rest/restController';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import ShopForm from '../../components/Forms/ShopForm/ShopForm';

function ShopAddPage({
  handleModalClose,
  fetchShops,
  crudError,
  setCrudError,
}) {
  const handleSubmitShop = async (values) => {
    setCrudError(null);
    try {
      await restController.addShop(
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

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Додавання магазину...'
      content={<ShopForm onSubmit={handleSubmitShop} />}
      error={crudError}
    />
  );
}

export default ShopAddPage;
