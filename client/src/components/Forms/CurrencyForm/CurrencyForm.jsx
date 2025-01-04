import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CurrencyForm({ currency = null, onSubmit }) {
  const initialValues = currency
    ? { title: currency.title, code: currency.code }
    : { title: '', code: '' };

  const fields = [
    {
      name: 'title',
      label: 'Назва валюти',
      placeholder: 'Наприклад "Австралійський долар"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'code',
      label: 'Міжнародний код валюти',
      placeholder: 'Наприклад "AUD"',
      required: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      submitButtonText={currency ? 'Зберегти зміни' : 'Додати валюту'}
      validationSchema={CURRENCY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CurrencyForm;
