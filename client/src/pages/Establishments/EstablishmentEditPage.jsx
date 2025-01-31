import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

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

  const { data: establishment, isLoading: isFetching } =
    useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const [editEstablishment, { isLoading: isSubmitting, error: submitError }] =
    useEditEstablishmentMutation();
  const [changeLogo, { isLoading: isUploading, error: uploadError }] =
    useChangeEstablishmentLogoMutation();
  const [resetLogo, { isLoading: isResetting, error: resetError }] =
    useResetEstablishmentLogoMutation();

  const isChanging = isUploading || isResetting;
  const error = uploadError || resetError || submitError;

  const handleUploadLogo = useCallback(
    (file) => changeLogo({ establishmentUuid: uuid, establishmentLogo: file }),
    [changeLogo, uuid]
  );

  const handleRemoveLogo = useCallback(
    () => resetLogo(uuid),
    [resetLogo, uuid]
  );

  const handleSubmitEstablishment = useCallback(
    async (values) => {
      const result = await editEstablishment({
        establishmentUuid: uuid,
        ...values,
      });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editEstablishment, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <EstablishmentForm
      establishment={establishment}
      isChanging={isChanging}
      isSubmitting={isSubmitting}
      onRemove={handleRemoveLogo}
      onSubmit={handleSubmitEstablishment}
      onUpload={handleUploadLogo}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentEditPage;
