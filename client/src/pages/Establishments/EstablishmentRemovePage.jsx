import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function EstablishmentRemovePage({
  handleModalClose,
  fetchEstablishments,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: establishment,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Establishment');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteEstablishment = async () => {
    try {
      await restController.removeEstablishment(establishment.uuid);
      handleModalClose();
      fetchEstablishments();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      actions={[
        <Button
          key='remove'
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
            Ви впевнені, що хочете видалити заклад «{establishment?.title}
            »? Це призведе до видалення всіх витрат, пов`язаних з цим закладом.
          </Typography>
        )
      }
      error={error || crudError}
      title='Видалення закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentRemovePage;
