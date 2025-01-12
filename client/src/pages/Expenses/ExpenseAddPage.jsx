import restController from '../../api/rest/restController';

import ExpenseForm from '../../components/Forms/ExpenseForm/ExpenseForm';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

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
    <ModalWindow
      isOpen
      showCloseButton
      content={
        <ExpenseForm
          currencies={currencies}
          establishments={establishments}
          measures={measures}
          products={products}
          onSubmit={handleSubmitExpense}
        />
      }
      error={crudError}
      title='Додавання витрати...'
      onClose={handleModalClose}
    />
  );
}

export default ExpenseAddPage;
