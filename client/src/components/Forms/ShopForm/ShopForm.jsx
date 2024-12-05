import { PRODUCT_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function ShopForm({ shop = null, onSubmit }) {
  const initialValues = shop
    ? { title: shop.title, description: shop.description, url: shop.url }
    : { title: '', description: '', url: '' };

  const fields = [
    {
      name: 'title',
      label: 'Назва магазину',
      placeholder: 'Наприклад "АТБ"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис магазину',
      placeholder: 'Наприклад "Один із найбільших..."',
    },
    {
      name: 'url',
      label: 'Веб сайт магазину',
      placeholder: 'Наприклад "https://www.atbmarket.com"',
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={PRODUCT_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={shop ? 'Зберегти зміни' : 'Додати магазин'}
    />
  );
}

export default ShopForm;
