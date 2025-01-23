import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function EstablishmentEditPage({
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

  const handleSubmitEstablishment = async (values) => {
    setCrudError(null);
    try {
      await restController.editEstablishment(
        establishment.uuid,
        values.title,
        values.description,
        values.url
      );
      handleModalClose();
      fetchEstablishments();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleUploadLogo = async (file) => {
    setCrudError(null);
    try {
      await restController.changeLogo(establishment.uuid, file);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleRemoveLogo = async () => {
    setCrudError(null);
    try {
      await restController.resetEstablishmentLogo(establishment.uuid);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <EstablishmentForm
            establishment={establishment}
            onRemoveLogo={handleRemoveLogo}
            onSubmit={handleSubmitEstablishment}
            onUploadLogo={handleUploadLogo}
          />
        )
      }
      error={error || crudError}
      title='Редагування закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentEditPage;
