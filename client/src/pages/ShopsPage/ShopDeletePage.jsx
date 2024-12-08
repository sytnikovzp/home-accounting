import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function ShopDeletePage({
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

  const handleDeleteShop = async () => {
    try {
      await restController.removeShop(shopToCRUD.id);
      handleModalClose();
      fetchShops();
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
      title='Видалення магазину...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography
            variant='body1'
            sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
          >
            Ви впевнені, що хочете видалити магазин "{shopToCRUD?.title}"?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteShop}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default ShopDeletePage;
