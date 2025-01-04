import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function CategoryForm({ category = null, onSubmit }) {
  const initialValues = category ? { title: category.title } : { title: '' };

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
      submitButtonText={category ? 'Зберегти зміни' : 'Додати категорію'}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default CategoryForm;
