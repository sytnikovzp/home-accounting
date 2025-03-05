import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useChangeEstablishmentLogoMutation,
  useEditEstablishmentMutation,
  useFetchEstablishmentByUuidQuery,
  useResetEstablishmentLogoMutation,
} from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
  const error = fetchError || submitError || uploadError || resetingError;

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
      const result = await editEstablishment({
        establishmentUuid: uuid,
        ...values,
      });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editEstablishment, handleModalClose, resetResetting, resetUploading, uuid]
  );

  const content = (
    <EstablishmentForm
      establishment={establishment}
      isChanging={isChangingLogo}
      isSubmitting={isSubmitting}
      onReset={handleResetLogo}
      onSubmit={handleSubmitEstablishment}
      onUpload={handleUploadLogo}
    />
  );

  if (error) {
    return (
      <InfoModal
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      isFetching={isFetching}
      title='Редагування закладу'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentEditPage;
