import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

function ExpenseRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const { product } = expense ?? {};

  const [removeExpense, { isLoading: isRemoving, error: removeError }] =
    useRemoveExpenseMutation();

  const isLoading = isFetching || isRemoving;
  const error = fetchError || removeError;

  const handleRemoveExpense = useCallback(async () => {
    const result = await removeExpense(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeExpense]);

  const actions = useMemo(
    () => [
      <Button
        key='remove'
        fullWidth
        color='error'
        disabled={isLoading}
        size='large'
        variant='contained'
        onClick={handleRemoveExpense}
      >
        Видалити
      </Button>,
    ],
    [isLoading, handleRemoveExpense]
  );

  const content = useMemo(() => {
    if (isFetching) {
      return <Preloader />;
    }
    return (
      <Typography sx={stylesRedlineTypography} variant='body1'>
        Ви впевнені, що хочете видалити витрату «{product?.title}»?
      </Typography>
    );
  }, [isFetching, product?.title]);

  return (
    <ModalWindow
      isOpen
      actions={actions}
      content={content}
      error={error?.data}
      title='Видалення витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseRemovePage;
