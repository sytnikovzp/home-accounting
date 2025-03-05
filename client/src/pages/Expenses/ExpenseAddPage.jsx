import { useCallback } from 'react';

import { Alert, Box, Button } from '@mui/material';

import { useAddExpenseMutation } from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

function ExpenseAddPage({ handleModalClose }) {
  const [addExpense, { isLoading: isSubmitting, error: submitError }] =
    useAddExpenseMutation();

  const error = submitError?.data;

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await addExpense(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addExpense, handleModalClose]
  );

  if (error) {
    return (
      <ModalWindow isOpen title={error.title} onClose={handleModalClose}>
        <Alert severity={error.severity}>{error.message}</Alert>
        <Box display='flex' justifyContent='center' mt={2}>
          <Button
            fullWidth
            color='success'
            variant='contained'
            onClick={handleModalClose}
          >
            Закрити
          </Button>
        </Box>
      </ModalWindow>
    );
  }

  return (
    <ModalWindow isOpen title='Додавання витрати' onClose={handleModalClose}>
      <ExpenseForm isSubmitting={isSubmitting} onSubmit={handleSubmitExpense} />
    </ModalWindow>
  );
}

export default ExpenseAddPage;
