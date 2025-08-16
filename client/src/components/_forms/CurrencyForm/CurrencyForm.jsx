import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { CURRENCY_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/_forms/BaseForm/BaseForm';

function CurrencyForm({ isSubmitting, currency = null, onSubmit }) {
  const { title, code } = currency ?? {};

  const initialValues = useMemo(
    () => ({
      title: title || '',
      code: code || '',
    }),
    [code, title]
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.currencyFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={CURRENCY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CurrencyForm;
