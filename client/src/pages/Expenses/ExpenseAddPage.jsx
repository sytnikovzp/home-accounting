import { useCallback } from 'react';

import { useAddExpenseMutation } from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ExpenseAddPage({ handleModalClose }) {
  const [addExpense, { isLoading: isSubmitting, error: submitError }] =
    useAddExpenseMutation();

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await addExpense(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addExpense, handleModalClose]
  );

  const content = (
    <ExpenseForm isSubmitting={isSubmitting} onSubmit={handleSubmitExpense} />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={submitError}
      title='Додавання витрати'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseAddPage;
