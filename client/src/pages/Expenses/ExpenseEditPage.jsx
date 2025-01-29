import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useEditExpenseMutation,
  useFetchAllCurrenciesQuery,
  useFetchAllEstablishmentsQuery,
  useFetchAllMeasuresQuery,
  useFetchAllProductsQuery,
  useFetchExpenseByUuidQuery,
} from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ExpenseEditPage({ handleModalClose }) {
  const { uuid } = useParams();

  const queries = [
    useFetchExpenseByUuidQuery(uuid),
    useFetchAllMeasuresQuery({ page: 1, limit: 500 }),
    useFetchAllCurrenciesQuery({ page: 1, limit: 500 }),
    useFetchAllEstablishmentsQuery({ page: 1, limit: 500 }),
    useFetchAllProductsQuery({ page: 1, limit: 500 }),
  ];

  const expense = queries[0]?.data;

  const isFetching = queries.some(({ isLoading }) => isLoading);

  const [editExpense, { isLoading, error }] = useEditExpenseMutation();

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await editExpense({
        expenseUuid: uuid,
        ...values,
      });
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
      currencies={queries[2].data?.data ?? []}
      establishments={queries[3].data?.data ?? []}
      expense={expense}
      isLoading={isLoading}
      measures={queries[1].data?.data ?? []}
      products={queries[4].data?.data ?? []}
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
