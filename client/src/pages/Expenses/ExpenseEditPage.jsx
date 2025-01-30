import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditExpenseMutation,
  useFetchExpenseByUuidQuery,
} from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ExpenseEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const { data: expense, isLoading: isFetching } =
    useFetchExpenseByUuidQuery(uuid);

  const [editExpense, { isLoading, error }] = useEditExpenseMutation();

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await editExpense({ expenseUuid: uuid, ...values });
      if (result?.data) {
        handleModalClose();
      }
    },
    [editExpense, handleModalClose, uuid]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ExpenseForm
      expense={expense}
      isLoading={isLoading}
      onSubmit={handleSubmitExpense}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Редагування витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseEditPage;
