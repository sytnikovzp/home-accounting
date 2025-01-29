import { useCallback } from 'react';

import {
  useAddExpenseMutation,
  useFetchAllCurrenciesQuery,
  useFetchAllEstablishmentsQuery,
  useFetchAllMeasuresQuery,
  useFetchAllProductsQuery,
} from '../../store/services';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ExpenseAddPage({ handleModalClose }) {
  const queries = [
    useFetchAllMeasuresQuery({ page: 1, limit: 500 }),
    useFetchAllCurrenciesQuery({ page: 1, limit: 500 }),
    useFetchAllEstablishmentsQuery({ page: 1, limit: 500 }),
    useFetchAllProductsQuery({ page: 1, limit: 500 }),
  ];

  const isFetching = queries.some(({ isLoading }) => isLoading);

  const [addExpense, { isLoading, error }] = useAddExpenseMutation();

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await addExpense(values);
      if (result?.data) {
        handleModalClose();
      }
    },
    [addExpense, handleModalClose]
  );

  const content = isFetching ? (
    <Preloader />
  ) : (
    <ExpenseForm
      currencies={queries[1].data?.data ?? []}
      establishments={queries[2].data?.data ?? []}
      isLoading={isLoading}
      measures={queries[0].data?.data ?? []}
      products={queries[3].data?.data ?? []}
      onSubmit={handleSubmitExpense}
    />
  );

  return (
    <ModalWindow
      isOpen
      content={content}
      error={error?.data}
      title='Додавання витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseAddPage;
