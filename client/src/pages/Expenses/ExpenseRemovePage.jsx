import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '@/src/store/services';

import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function ExpenseRemovePage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expenseData,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const [removeExpense, { isLoading: isRemoving, error: removeError }] =
    useRemoveExpenseMutation();

  const apiError = fetchError?.data || removeError?.data;

  const confirmMessage = `Ви впевнені, що хочете видалити витрату «${expenseData?.product?.title}» на
          сумму ${expenseData?.totalPrice} UAH за ${expenseData?.date}?`;

  const handleRemove = useCallback(async () => {
    const response = await removeExpense(uuid);
    if (response?.data) {
      handleModalClose();
    }
  }, [uuid, handleModalClose, removeExpense]);

  if (apiError) {
    return (
      <ModalWindow
        isOpen
        showCloseButton
        title={apiError.title}
        onClose={handleModalClose}
      >
        <Alert severity={apiError.severity}>{apiError.message}</Alert>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow
      isOpen
      showDeleteButtons
      deleteButtonDisabled={isRemoving || isFetching}
      deleteConfirmMessage={confirmMessage}
      isFetching={isFetching}
      title='Видалення витрати'
      onClose={handleModalClose}
      onDelete={handleRemove}
    />
  );
}

export default ExpenseRemovePage;
