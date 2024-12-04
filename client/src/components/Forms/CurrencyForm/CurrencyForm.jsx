import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function CurrencyForm({ сurrency = null, onSubmit }) {
  const initialValues = сurrency
    ? { title: сurrency.title, description: сurrency.description }
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
      submitButtonText={сurrency ? 'Зберегти зміни' : 'Додати валюту'}
    />
  );
}

export default CurrencyForm;
