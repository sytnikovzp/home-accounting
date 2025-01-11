import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

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
      showCloseButton
      actions={[
        <Button
          key='delete'
          fullWidth
          color='error'
          size='large'
          variant='contained'
          onClick={handleDeleteEstablishment}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити заклад «{establishmentToCRUD?.title}
            »? Це призведе до видалення всіх витрат, пов`язаних з цим закладом.
          </Typography>
        )
      }
      error={errorMessage || crudError}
      title='Видалення закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentDeletePage;
