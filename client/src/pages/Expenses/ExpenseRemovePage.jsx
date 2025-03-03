import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';
import InfoModal from '../../components/ModalWindow/InfoModal';

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

  if (error) {
    return (
      <InfoModal
        isOpen
        message={error.data?.message}
        severity={error.data?.severity}
        title={error.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  const message = `Ви впевнені, що хочете видалити витрату «${product?.title}»
    на сумму ${totalPrice} UAH за ${date}?`;

  return (
    <DeleteConfirmModal
      isOpen
      isFetching={isFetching}
      isSubmitting={isRemoving}
      message={message}
      title='Видалення витрати'
      onClose={handleModalClose}
      onSubmit={handleRemoveExpense}
    />
  );
}

export default ExpenseRemovePage;
