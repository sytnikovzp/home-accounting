import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFetchExpenseByUuidQuery,
  useRemoveExpenseMutation,
} from '../../store/services';

import DeleteConfirmModal from '../../components/ModalWindow/DeleteConfirmModal';

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

  const message = `Ви впевнені, що хочете видалити витрату «${product?.title}»
    на сумму ${totalPrice} UAH за ${date}?`;

  return (
    <DeleteConfirmModal
      error={error}
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
