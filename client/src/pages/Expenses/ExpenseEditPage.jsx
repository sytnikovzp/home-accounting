import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  useEditExpenseMutation,
  useFetchExpenseByUuidQuery,
} from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ExpenseEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expense,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const [editExpense, { isLoading: isSubmitting, error: submitError }] =
    useEditExpenseMutation();

  const error = fetchError?.data || submitError?.data;

  const handleSubmitExpense = useCallback(
    async (values) => {
      const response = await editExpense({ expenseUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editExpense, handleModalClose, uuid]
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
    <ModalWindow isOpen title='Редагування витрати' onClose={handleModalClose}>
      {isFetching ? (
        <Preloader />
      ) : (
        <ExpenseForm
          expense={expense}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitExpense}
        />
      )}
    </ModalWindow>
  );
}

export default ExpenseEditPage;
