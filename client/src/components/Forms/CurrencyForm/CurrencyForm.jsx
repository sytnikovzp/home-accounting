import { useMemo } from 'react';

import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CurrencyForm({ isLoading, currency = null, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      title: currency?.title || '',
      code: currency?.code || '',
    }),
    [currency]
  );

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
      isLoading={isLoading}
      submitButtonText={currency ? 'Зберегти зміни' : 'Додати валюту'}
      validationSchema={CURRENCY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CurrencyForm;
