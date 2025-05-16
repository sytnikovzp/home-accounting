import { useMemo } from 'react';

import { FORM_RENDER_FIELDS } from '../../../constants';
import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

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
