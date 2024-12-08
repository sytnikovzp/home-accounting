import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function CurrencyDeletePage({
  handleModalClose,
  fetchCurrencies,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: currencyToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Currency');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleDeleteCurrency = async () => {
    try {
      await restController.removeCurrency(currencyToCRUD.id);
      handleModalClose();
      fetchCurrencies();
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
      title='Видалення категорії...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography
            variant='body1'
            sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
          >
            Ви впевнені, що хочете видалити валюту "{currencyToCRUD?.title}"?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteCurrency}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default CurrencyDeletePage;
