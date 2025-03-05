import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';
import Preloader from '../../components/Preloader/Preloader';

import { stylesRedlineTypography } from '../../styles';

function ExpenseRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const { product, date, totalPrice } = expense ?? {};

  const [removeExpense, { isLoading: isRemoving, error: removeError }] =
    useRemoveExpenseMutation();

  const error = fetchError || removeError;

  const handleRemoveExpense = useCallback(async () => {
    const result = await removeExpense(uuid);
    if (result?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeExpense]);

  const content = isFetching ? (
    <Preloader />
  ) : (
    <Typography sx={stylesRedlineTypography} variant='body1'>
      Ви впевнені, що хочете видалити витрату «{product?.title}» на сумму{' '}
      {totalPrice} UAH за {date}?
    </Typography>
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
    <DeleteConfirmModal
      content={content}
      isFetching={isFetching}
      isSubmitting={isRemoving}
      title='Видалення витрати'
      onClose={handleModalClose}
      onSubmit={handleRemoveExpense}
    />
  );
}

export default ExpenseRemovePage;
