import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function ProductDeletePage({
  handleModalClose,
  fetchProducts,
  crudError,
  setCrudError,
}) {
  const { id } = useParams();
  const {
    entity: productToCRUD,
    isLoading,
    errorMessage,
    fetchEntityById,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (id) fetchEntityById(id);
  }, [id, fetchEntityById]);

  const handleDeleteProduct = async () => {
    try {
      await restController.removeProduct(productToCRUD.id);
      handleModalClose();
      fetchProducts();
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
      title='Видалення товару...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography
            variant='body1'
            sx={{ textAlign: 'justify', mt: 2, mb: 2 }}
          >
            Ви впевнені, що хочете видалити товар "{productToCRUD?.title}"?
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteProduct}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default ProductDeletePage;
