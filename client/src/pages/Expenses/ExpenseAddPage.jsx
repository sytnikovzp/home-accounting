import { useCallback } from 'react';

import Alert from '@mui/material/Alert';

import { useAddExpenseMutation } from '@/src/store/services';

import ExpenseForm from '@/src/components/_forms/ExpenseForm/ExpenseForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function ExpenseAddPage({ handleModalClose }) {
  const [addExpense, { isLoading: isSubmitting, error: submitError }] =
    useAddExpenseMutation();

  const apiError = submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await addExpense(values);
      if (response?.data) {
        handleModalClose();
      }
    },
    [addExpense, handleModalClose]
  );

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
    <ModalWindow isOpen title='Додавання витрати' onClose={handleModalClose}>
      <ExpenseForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ModalWindow>
  );
}

export default ExpenseAddPage;
