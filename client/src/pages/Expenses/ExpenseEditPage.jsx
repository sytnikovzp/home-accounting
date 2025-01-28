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

  const { data: expense, isLoading: isFetchingExpense } =
    useFetchExpenseByUuidQuery(uuid);

  const { data: measuresData, isLoading: isFetchingMeasures } =
    useFetchAllMeasuresQuery({ page: 1, limit: 500 });

  const { data: currenciesData, isLoading: isFetchingCurrencies } =
    useFetchAllCurrenciesQuery({ page: 1, limit: 500 });

  const { data: establishmentsData, isLoading: isFetchingEstablishments } =
    useFetchAllEstablishmentsQuery({ page: 1, limit: 500 });

  const { data: productsData, isLoading: isFetchingProducts } =
    useFetchAllProductsQuery({ page: 1, limit: 500 });

  const measures = measuresData?.data || [];
  const currencies = currenciesData?.data || [];
  const establishments = establishmentsData?.data || [];
  const products = productsData?.data || [];

  const [editExpense, { isLoading, error }] = useEditExpenseMutation();

  const isFetching =
    isFetchingExpense ||
    isFetchingMeasures ||
    isFetchingCurrencies ||
    isFetchingEstablishments ||
    isFetchingProducts;

  const handleSubmitExpense = useCallback(
    async (values) => {
      const result = await editExpense({
        expenseUuid: uuid,
        product: values.product,
        quantity: values.quantity,
        unitPrice: values.unitPrice,
        establishment: values.establishment,
        measure: values.measure,
        currency: values.currency,
        date: values.date,
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
      currencies={currencies}
      establishments={establishments}
      expense={expense}
      isLoading={isLoading}
      measures={measures}
      products={products}
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
