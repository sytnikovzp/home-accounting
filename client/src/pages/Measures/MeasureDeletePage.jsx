import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function MeasureDeletePage({
  handleModalClose,
  fetchMeasures,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: measureToCRUD,
    isLoading,
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Measure');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleDeleteMeasure = async () => {
    try {
      await restController.removeMeasure(measureToCRUD.uuid);
      handleModalClose();
      fetchMeasures();
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
          onClick={handleDeleteMeasure}
        >
          Видалити
        </Button>,
      ]}
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <Typography sx={stylesDeletePageTypography} variant='body1'>
            Ви впевнені, що хочете видалити одиницю вимірів «
            {measureToCRUD?.title}»? Це призведе до видалення всіх витрат, де
            вона використовується.
          </Typography>
        )
      }
      error={errorMessage || crudError}
      title='Видалення одиниці...'
      onClose={handleModalClose}
    />
  );
}

export default MeasureDeletePage;
