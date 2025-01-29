import { groupByFirstLetter } from '../../../utils/sharedFunctions';
import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ProductForm({ isLoading, product = null, onSubmit, categories = [] }) {
  const { uuid, title, category } = product || {};

  const initialValues = {
    title: title || '',
    category: category?.title || '',
  };

  const groupedCategories = groupByFirstLetter(
    [...categories],
    'title',
    'title'
  );

  const fields = [
    {
      name: 'title',
      label: 'Назва товару',
      placeholder: 'Наприклад "Футболка"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'category',
      label: 'Категорія товару',
      type: 'autocomplete',
      options: groupedCategories,
      placeholder: 'Наприклад "Одяг"',
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      submitButtonText={uuid ? 'Зберегти зміни' : 'Додати товар'}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ProductForm;
