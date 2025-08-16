import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '@/src/constants';
import { CATEGORY_VALIDATION_SCHEME } from '@/src/utils/validationSchemes';

import BaseForm from '@/src/components/forms/BaseForm';

function CategoryForm({ isSubmitting, category = null, onSubmit }) {
  const { title } = category ?? {};

  const initialValues = useMemo(
    () => ({
      title: title || '',
    }),
    [title]
  );

  return (
    <BaseForm
      fields={FORM_RENDER_FIELDS.categoryFields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CategoryForm;
