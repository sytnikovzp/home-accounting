import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CategoryForm({ isSubmitting, category = null, onSubmit }) {
  const { uuid, title } = category ?? {};

  const initialValues = {
    title: title || '',
  };

  const fields = [
    {
      name: 'title',
      label: 'Назва категорії',
      placeholder: 'Наприклад "Електроніка"',
      required: true,
      autoFocus: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      submitButtonText={uuid ? 'Зберегти зміни' : 'Додати категорію'}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CategoryForm;
