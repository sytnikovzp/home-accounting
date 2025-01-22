import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Preloader from '../../components/Preloader/Preloader';

function ExpenseEditPage({
  handleModalClose,
  fetchExpenses,
  products,
  establishments,
  measures,
  currencies,
  crudError,
  setCrudError,
}) {
  const { uuid } = useParams();
  const {
    entity: expenseToCRUD,
    isLoading,
    error,
    fetchEntityByUuid,
  } = useFetchEntity('Expense');

  useEffect(() => {
    if (uuid) {
      fetchEntityByUuid(uuid);
    }
  }, [uuid, fetchEntityByUuid]);

  const handleSubmitExpense = async (values) => {
    setCrudError(null);
    try {
      await restController.editExpense(
        expenseToCRUD.uuid,
        values.product,
        values.quantity,
        values.unitPrice,
        values.establishment,
        values.measure,
        values.currency,
        values.date
      );
      handleModalClose();
      fetchExpenses();
    } catch (error) {
      setCrudError(error.response.data);
    }
  };

  return (
    <ModalWindow
      isOpen
      showCloseButton
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ExpenseForm
            currencies={currencies}
            establishments={establishments}
            expense={expenseToCRUD}
            measures={measures}
            products={products}
            onSubmit={handleSubmitExpense}
          />
        )
      }
      error={error || crudError}
      title='Редагування витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseEditPage;
