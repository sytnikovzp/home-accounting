import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CurrencyForm({ isSubmitting, currency = null, onSubmit }) {
  const { title, code } = currency ?? {};

  const initialValues = {
    title: title || '',
    code: code || '',
  };

  const renderFields = [
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
      fields={renderFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={CURRENCY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CurrencyForm;
