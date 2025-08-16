import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';

import {
  useEditExpenseMutation,
  useFetchExpenseByUuidQuery,
} from '@/src/store/services';

import ExpenseForm from '@/src/components/_forms/ExpenseForm/ExpenseForm';
import ModalWindow from '@/src/components/ModalWindow/ModalWindow';

function ExpenseEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const {
    data: expenseData,
    isFetching,
    error: fetchError,
  } = useFetchExpenseByUuidQuery(uuid, { skip: !uuid });

  const [editExpense, { isLoading: isSubmitting, error: submitError }] =
    useEditExpenseMutation();

  const apiError = fetchError?.data || submitError?.data;

  const handleSubmit = useCallback(
    async (values) => {
      const response = await editExpense({ expenseUuid: uuid, ...values });
      if (response?.data) {
        handleModalClose();
      }
    },
    [editExpense, handleModalClose, uuid]
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
    <ModalWindow
      isOpen
      isFetching={isFetching}
      title='Редагування витрати'
      onClose={handleModalClose}
    >
      <ExpenseForm
        expense={expenseData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalWindow>
  );
}

export default ExpenseEditPage;
