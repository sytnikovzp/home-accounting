import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function CurrencyForm({ currency = null, onSubmit }) {
  const initialValues = currency
    ? { title: currency.title, description: currency.description }
    : { title: '', description: '' };

  const fields = [
    {
      name: 'title',
      label: 'Назва валюти',
      placeholder: 'Наприклад "AUD"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис валюти',
      placeholder: 'Наприклад "Австралійський долар"',
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={CURRENCY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={currency ? 'Зберегти зміни' : 'Додати валюту'}
    />
  );
}

export default CurrencyForm;
