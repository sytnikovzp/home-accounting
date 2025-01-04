import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import restController from '../../api/rest/restController';
import useFetchEntity from '../../hooks/useFetchEntity';

import CustomModal from '../../components/CustomModal/CustomModal';
import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
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
    errorMessage,
    fetchEntityByUuid,
  } = useFetchEntity('Expense');

  useEffect(() => {
    if (uuid) fetchEntityByUuid(uuid);
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
    <CustomModal
      isOpen
      onClose={handleModalClose}
      showCloseButton
      title='Редагування витрати...'
      content={
        isLoading ? (
          <Preloader />
        ) : (
          <ExpenseForm
            expense={expenseToCRUD}
            onSubmit={handleSubmitExpense}
            products={products}
            establishments={establishments}
            measures={measures}
            currencies={currencies}
          />
        )
      }
      error={errorMessage || crudError}
    />
  );
}

export default ExpenseEditPage;
