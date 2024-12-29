import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
// ==============================================================
import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';
// ==============================================================
import CustomModal from '../../components/CustomModal/CustomModal';
import Preloader from '../../components/Preloader/Preloader';

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
    if (uuid) fetchEntityByUuid(uuid);
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
      onClose={handleModalClose}
      showCloseButton
      title='Видалення одиниці...'
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
            Ви впевнені, що хочете видалити одиницю вимірів «
            {measureToCRUD?.title}»? Це призведе до видалення всіх витрат, де
            вона використовується.
          </Typography>
        )
      }
      actions={[
        <Button
          key='delete'
          variant='contained'
          color='error'
          size='large'
          onClick={handleDeleteMeasure}
          fullWidth
        >
          Видалити
        </Button>,
      ]}
      error={errorMessage || crudError}
    />
  );
}

export default MeasureDeletePage;
