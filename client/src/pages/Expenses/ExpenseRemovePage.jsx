import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ExpenseRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const [removeExpense, { isLoading: isRemoving, error: removeError }] =
    useRemoveExpenseMutation();

  const error = fetchError?.data || removeError?.data;

  const handleRemoveExpense = useCallback(async () => {
    const response = await removeExpense(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeExpense]);

  if (error) {
    return (
      <ModalWindow
        isOpen
        actionsOnCenter={
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        }
        title={error.title}
        onClose={handleModalClose}
      >
        <Alert severity={error.severity}>{error.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      actionsOnRight={
        <>
          <Button color='default' variant='text' onClick={handleModalClose}>
            Скасувати
          </Button>
          <Button
            color='error'
            disabled={isRemoving || isFetching}
            variant='contained'
            onClick={handleRemoveExpense}
          >
            Видалити
          </Button>
        </>
      }
      confirmMessage={`Ви впевнені, що хочете видалити витрату «${expense?.product?.title}» на
          сумму ${expense?.totalPrice} UAH за ${expense?.date}?`}
      isFetching={isFetching}
      title='Видалення витрати'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseRemovePage;
