import { useMemo } from 'react';
// ==============================================================
import { PURCHASE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';
// ==============================================================
import BaseForm from '../BaseForm/BaseForm';

function PurchaseForm({
  purchase = null,
  onSubmit,
  products,
  shops,
  measures,
  currencies,
}) {
  const initialValues = purchase
    ? {
        product: purchase.product,
        amount: purchase.amount,
        price: purchase.price,
        shop: purchase.shop,
        measure: purchase.measure,
        currency: purchase.currency,
        date: purchase.date,
      }
    : {
        product: '',
        amount: '',
        price: '',
        shop: '',
        measure: '',
        currency: '',
        date: '',
      };

  const groupedProducts = useMemo(() => {
    return products
      .sort((a, b) => a.title.localeCompare(b.title))
      .reduce((acc, product) => {
        const firstLetter = product.title[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push({ label: product.title, value: product.title });
        return acc;
      }, {});
  }, [products]);

  const fields = [
    {
      name: 'product',
      label: 'Товар',
      type: 'autocomplete',
      options: groupedProducts,
      placeholder: 'Наприклад "Помідори"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'amount',
      label: 'Кількість',
      placeholder: 'Наприклад "1"',
      required: true,
    },
    {
      name: 'price',
      label: 'Ціна за одиницю',
      placeholder: 'Наприклад "80"',
      required: true,
    },
    {
      name: 'shop',
      label: 'Магазин',
      type: 'select',
      options: [
        { value: '', label: 'Оберіть магазин:' },
        ...shops.map((cat) => ({
          value: cat.title,
          label: cat.title,
        })),
      ],
      placeholder: 'Наприклад "АТБ"',
      required: true,
    },
    {
      name: 'measure',
      label: 'Одиниця вимірювань',
      type: 'select',
      options: [
        { value: '', label: 'Оберіть одиницю:' },
        ...measures.map((cat) => ({
          value: cat.title,
          label: cat.description,
        })),
      ],
      placeholder: 'Наприклад "кг"',
      required: true,
    },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'select',
      options: [
        { value: '', label: 'Оберіть валюту:' },
        ...currencies.map((cat) => ({
          value: cat.title,
          label: cat.description,
        })),
      ],
      placeholder: 'Наприклад "UAH"',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Дата покупки',
      placeholder: 'Наприклад "02 грудня 2024"',
      required: true,
    },
  ];

  return (
    <BaseForm
      initialValues={initialValues}
      validationSchema={PURCHASE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
      fields={fields}
      submitButtonText={purchase ? 'Зберегти зміни' : 'Додати покупку'}
      layout='purchase'
    />
  );
}

export default PurchaseForm;
