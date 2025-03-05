import { useCallback } from 'react';

import { useAddExpenseMutation } from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import InfoModal from '../../components/ModalWindow/InfoModal';
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

  if (submitError) {
    return (
      <InfoModal
        message={submitError.data?.message}
        severity={submitError.data?.severity}
        title={submitError.data?.title}
        onClose={handleModalClose}
      />
    );
  }

  return (
    <ModalWindow
      isOpen
      content={content}
      title='Додавання витрати'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseAddPage;
