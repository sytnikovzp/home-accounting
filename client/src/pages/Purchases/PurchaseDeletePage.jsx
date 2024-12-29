import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function PurchaseDeletePage({
  handleModalClose,
  fetchPurchases,
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

  const handleDeletePurchase = async () => {
    try {
      await restController.removePurchase(purchaseToCRUD.uuid);
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
      title='Видалення витрати...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography
            variant='body1'
            sx={{
              textAlign: 'justify',
              mt: 2,
              mb: 2,
              textIndent: '2em',
            }}
          >
            Ви впевнені, що хочете видалити покупку «
            {purchaseToCRUD?.product.title}»?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeletePurchase}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default PurchaseDeletePage;
