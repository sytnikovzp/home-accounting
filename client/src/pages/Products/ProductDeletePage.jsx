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
  const { uuid } = useParams();
  const {
    entity: productToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Product');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteProduct = async () => {
    try {
      await restController.removeProduct(productToCRUD.uuid);
      handleModalClose();
      fetchProducts();
    } catch (error) {
      setCrudError(error.response.data);
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
            sx={{
              textAlign: 'justify',
              mt: 2,
              mb: 2,
              textIndent: '2em',
            }}
          >
            Ви впевнені, що хочете видалити товар «{productToCRUD?.title}»? Це
            призведе до видалення всіх покупок, що містять цей товар.
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
