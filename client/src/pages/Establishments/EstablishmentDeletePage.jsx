import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

function EstablishmentDeletePage({
  handleModalClose,
  fetchEstablishments,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: establishmentToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Establishment');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteEstablishment = async () => {
    try {
      await restController.removeEstablishment(establishmentToCRUD.uuid);
      handleModalClose();
      fetchEstablishments();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Видалення закладу...'
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
            Ви впевнені, що хочете видалити заклад «{establishmentToCRUD?.title}
            »? Це призведе до видалення всіх витрат, пов'язаних з цим закладом.
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteEstablishment}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default EstablishmentDeletePage;
