import { useMemo } from 'react';

import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ProductForm({ product = null, onSubmit, categories }) {
  const initialValues = product
    ? { title: product.title, category: product.category.title }
    : { title: '', category: '' };

  const groupedCategories = useMemo(() => {
    return categories
      .sort((a, b) => a.title.localeCompare(b.title))
      .reduce((acc, category) => {
        const firstLetter = category.title[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push({
          label: category.title,
          value: category.title,
        });
        return acc;
      }, {});
  }, [categories]);

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
      required: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      submitButtonText={product ? 'Зберегти зміни' : 'Додати товар'}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ProductForm;
