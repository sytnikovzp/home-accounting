import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function ProductForm({ product = null, onSubmit, categories }) {
  const initialValues = product
    ? { title: product.title, category: product.category }
    : { title: '', category: '' };

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
      type: 'select',
      options: [
        { value: '', label: 'Оберіть категорію:' },
        ...categories.map((cat) => ({
          value: cat.title,
          label: cat.title,
        })),
      ],
      placeholder: 'Наприклад "Одяг"',
      required: true,
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={product ? 'Зберегти зміни' : 'Додати товар'}
    />
  );
}

export default ProductForm;
