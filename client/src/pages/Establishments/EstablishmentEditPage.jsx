import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditEstablishmentMutation,
  useFetchEstablishmentByUuidQuery,
} from '../../store/services';

import EstablishmentForm from '../../components/Forms/EstablishmentForm/EstablishmentForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function EstablishmentEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: establishment, isLoading: isFetching } =
    useFetchEstablishmentByUuidQuery(uuid);

  const [editEstablishment, { isLoading, error }] =
    useEditEstablishmentMutation();

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
      isLoading={isLoading}
      onSubmit={handleSubmitEstablishment}
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
