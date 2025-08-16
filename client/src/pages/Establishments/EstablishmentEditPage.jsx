import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useChangeEstablishmentLogoMutation,
  useEditEstablishmentMutation,
  useFetchEstablishmentByUuidQuery,
  useResetEstablishmentLogoMutation,
} from '@/src/store/services';

import EstablishmentForm from '@/src/components/forms/EstablishmentForm';
import ModalWindow from '@/src/components/ModalWindow';

function EstablishmentEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: establishmentData,
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
  const apiError =
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

  const handleSubmit = useCallback(
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

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування закладу'
      onClose={handleModalClose}
    >
      <EstablishmentForm
        establishment={establishmentData}
        isChanging={isChangingLogo}
        isSubmitting={isSubmitting}
        onReset={handleResetLogo}
        onSubmit={handleSubmit}
        onUpload={handleUploadLogo}
      />
    </ModalWindow>
  );
}

export default EstablishmentEditPage;
