import { useMemo } from 'react';

import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CategoryForm({ isLoading, category = null, onSubmit }) {
  const initialValues = useMemo(
    () => ({ title: category?.title || '' }),
    [category]
  );

  const fields = useMemo(
    () => [
      {
        name: 'title',
        label: 'Назва категорії',
        placeholder: 'Наприклад "Електроніка"',
        required: true,
        autoFocus: true,
      },
    ],
    []
  );

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      submitButtonText={category ? 'Зберегти зміни' : 'Додати категорію'}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CategoryForm;
