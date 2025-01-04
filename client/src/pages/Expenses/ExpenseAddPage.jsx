import restController from '../../api/rest/restController';

import CustomModal from '../../components/CustomModal/CustomModal';
import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';

function ExpenseAddPage({
  handleModalClose,
  fetchExpenses,
  products,
  establishments,
  measures,
  currencies,
  crudError,
  setCrudError,
}) {
  const handleSubmitExpense = async (values) => {
    setCrudError(null);
    try {
      await restController.addExpense(
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
      title='Додавання витрати...'
      content={
        <ExpenseForm
          onSubmit={handleSubmitExpense}
          products={products}
          establishments={establishments}
          measures={measures}
          currencies={currencies}
        />
      }
      error={crudError}
    />
  );
}

export default ExpenseAddPage;
