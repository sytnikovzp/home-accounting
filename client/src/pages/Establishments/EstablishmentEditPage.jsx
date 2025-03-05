import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useChangeEstablishmentLogoMutation,
  useEditEstablishmentMutation,
  useFetchEstablishmentByUuidQuery,
  useResetEstablishmentLogoMutation,
} from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function EstablishmentEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishment,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const [
    editEstablishment,
    { isLoading: isSubmitting, error: submitError, reset: resetSubmitting },
  ] = useEditEstablishmentMutation();
  const [
    changeLogo,
    { isLoading: isUploading, error: uploadError, reset: resetUploading },
  ] = useChangeEstablishmentLogoMutation();
  const [
    resetLogo,
    { isLoading: isResetting, error: resetingError, reset: resetResetting },
  ] = useResetEstablishmentLogoMutation();

  const isChangingLogo = isUploading || isResetting;
  const error =
    fetchError?.data ||
    submitError?.data ||
    uploadError?.data ||
    resetingError?.data;

  const handleUploadLogo = useCallback(
    async (file) => {
      resetSubmitting();
      resetResetting();
      await changeLogo({ establishmentUuid: uuid, establishmentLogo: file });
    },
    [changeLogo, resetResetting, resetSubmitting, uuid]
  );

  const handleResetLogo = useCallback(async () => {
    resetSubmitting();
    resetUploading();
    await resetLogo(uuid);
  }, [resetLogo, resetSubmitting, resetUploading, uuid]);

  const handleSubmitEstablishment = useCallback(
    async (values) => {
      resetUploading();
      resetResetting();
      const response = await editEstablishment({
        establishmentUuid: uuid,
        ...values,
      });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editEstablishment, handleModalClose, resetResetting, resetUploading, uuid]
  );

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Редагування закладу' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <EstablishmentForm
          establishment={establishment}
          isChanging={isChangingLogo}
          isSubmitting={isSubmitting}
          onReset={handleResetLogo}
          onSubmit={handleSubmitEstablishment}
          onUpload={handleUploadLogo}
        />
      )}
    </ModalWindow>
  );
}

export default EstablishmentEditPage;
