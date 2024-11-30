import { CATEGORY_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

const CategoryForm = ({ onSubmit }) => {
  const fields = [
    {
      name: 'title',
      label: 'Назва категорії',
      placeholder: 'Наприклад, Електроніка',
    },
  ];

  return (
    <BaseForm
      initialValues={{ title: '' }}
      validationSchema={CATEGORY_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Додати категорію'
    />
  );
};

export default CategoryForm;
