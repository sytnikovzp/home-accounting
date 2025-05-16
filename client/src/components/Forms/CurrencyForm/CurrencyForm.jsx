import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '../../../constants';
import { CURRENCY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

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
