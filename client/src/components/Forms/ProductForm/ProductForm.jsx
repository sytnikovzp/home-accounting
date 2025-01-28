import { useMemo } from 'react';

import { groupByFirstLetter } from '../../../utils/sharedFunctions';
import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ProductForm({ isLoading, product = null, onSubmit, categories = [] }) {
  const initialValues = useMemo(
    () => ({
      title: product?.title || '',
      category: product?.category?.title || '',
    }),
    [product]
  );

  const groupedCategories = useMemo(
    () => groupByFirstLetter([...categories], 'title', 'title'),
    [categories]
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
      submitButtonText={product ? 'Зберегти зміни' : 'Додати товар'}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ProductForm;
