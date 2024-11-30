import { PURCHASE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

const PurchaseForm = ({ onSubmit, products, shops, measures, currencies }) => {
  const fields = [
    {
      name: 'product',
      label: 'Продукт',
      type: 'select',
      options: products,
    },
    {
      name: 'amount',
      label: 'Кількість',
      type: 'number',
      placeholder: 'Наприклад, 2',
    },
    {
      name: 'price',
      label: 'Ціна',
      type: 'number',
      placeholder: 'Наприклад, 500',
    },
    {
      name: 'shop',
      label: 'Магазин',
      type: 'select',
      options: shops,
    },
    {
      name: 'measure',
      label: 'Одиниця виміру',
      type: 'select',
      options: measures,
    },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'select',
      options: currencies,
    },
  ];

  return (
    <BaseForm
      initialValues={{
        product: '',
        amount: '',
        price: '',
        shop: '',
        measure: '',
        currency: '',
      }}
      validationSchema={PURCHASE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText='Додати покупку'
    />
  );
};

export default PurchaseForm;
