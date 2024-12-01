import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function CategoryForm({ category = null, onSubmit }) {
  const initialValues = category ? { title: category.title } : { title: '' };

  const fields = [
    {
      name: 'title',
      label: 'Назва категорії',
      placeholder: 'Наприклад "Електроніка"',
      autoFocus: true,
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={category ? 'Зберегти зміни' : 'Додати категорію'}
    />
  );
}

export default CategoryForm;
