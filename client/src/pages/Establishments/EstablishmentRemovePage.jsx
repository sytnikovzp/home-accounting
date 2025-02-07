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

  const {
    data: establishment,
    isFetching,
    error: fetchError,
  } = useFetchEstablishmentByUuidQuery(uuid, { skip: !uuid });

  const { title } = establishment ?? {};

  const [removeEstablishment, { isLoading: isRemoving, error: removeError }] =
    useRemoveEstablishmentMutation();

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveEstablishment = useCallback(async () => {
    const result = await removeEstablishment(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeEstablishment]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveEstablishment}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveEstablishment]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesDeletePageTypography} variant='body1'>
        Ви впевнені, що хочете видалити заклад «{title}
        »? Це призведе до видалення всіх витрат, пов`язаних з цим закладом.
      </Typography>
    );
  }, [isFetching, title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення закладу...'
      onClose={handleModalClose}
    />
  );
}

export default EstablishmentRemovePage;
