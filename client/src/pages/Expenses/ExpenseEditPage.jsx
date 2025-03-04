import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditExpenseMutation,
  useFetchExpenseByUuidQuery,
} from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ExpenseEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const [editExpense, { isLoading: isSubmitting, error: submitError }] =
    useEditExpenseMutation();

  const error = fetchError || submitError;

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await editExpense({ expenseUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editExpense, handleModalClose, uuid]
  );

  const content = (
    <ExpenseForm
      expense={expense}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmitExpense}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error}
      isFetching={isFetching}
      title='Редагування витрати'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseEditPage;
