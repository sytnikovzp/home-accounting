import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import Preloader from '../../components/Preloader/Preloader';

function EstablishmentEditPage({
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

  const handleSubmitEstablishment = async (values) => {
    setCrudError(null);
    try {
      await restController.editEstablishment(
        establishmentToCRUD.uuid,
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
      await restController.uploadEstablishmentLogo(
        establishmentToCRUD.uuid,
        file
      );
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  const handleRemoveLogo = async () => {
    setCrudError(null);
    try {
      await restController.removeEstablishmentLogo(establishmentToCRUD.uuid);
      fetchEntityByUuid(uuid);
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <CustomModal
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <EstablishmentForm
            establishment={establishmentToCRUD}
            onRemoveLogo={handleRemoveLogo}
            onSubmit={handleSubmitEstablishment}
            onUploadLogo={handleUploadLogo}
          />
        )
      }
      error={errorMessage || crudError}
      title='Редагування закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentEditPage;
