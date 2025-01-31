import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

import {
  useFetchEstablishmentByUuidQuery,
  useRemoveEstablishmentMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesDeletePageTypography } from '../../styles';

function EstablishmentRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: establishment, isLoading: isFetching } =
    useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const [removeEstablishment, { isLoading: isRemoving, error: removeError }] =
    useRemoveEstablishmentMutation();

  const handleDeleteEstablishment = useCallback(async () => {
    if (!establishment?.uuid) {
      return;
    }
    const result = await removeEstablishment(establishment.uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [establishment?.uuid, handleModalClose, removeEstablishment]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isRemoving}
        size='large'
        variant='contained'
        onClick={handleDeleteEstablishment}
      >
        Видалити
      </Button>,
    ],
    [isRemoving, handleDeleteEstablishment]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити заклад «{establishment?.title}
        »? Це призведе до видалення всіх витрат, пов`язаних з цим закладом.
      </Typography>
    );
  }, [isFetching, establishment?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={removeError?.data}
      title='Видалення закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentRemovePage;
