import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { MEASURE_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/_forms/BaseForm/BaseForm';

function MeasureForm({ isSubmitting, measure = null, onSubmit }) {
  const { title, description } = measure ?? {};

  const initialValues = useMemo(
    () => ({
      title: title || '',
      description: description || '',
    }),
    [title, description]
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.measureFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={MEASURE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default MeasureForm;
