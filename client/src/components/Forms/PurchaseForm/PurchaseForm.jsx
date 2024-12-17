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
        product: purchase.product.title,
        quantity: purchase.quantity,
        unitPrice: purchase.unitPrice,
        shop: purchase.shop.title,
        measure: purchase.measure.title,
        currency: purchase.currency.title,
        date: purchase.date,
      }
    : {
        product: '',
        quantity: '',
        unitPrice: '',
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
        acc[firstLetter].push({
          label: product.title,
          value: product.title,
        });
        return acc;
      }, {});
  }, [products]);

  const groupedCurrencies = useMemo(() => {
    return currencies
      .sort((a, b) => a.title.localeCompare(b.title))
      .reduce((acc, currency) => {
        const firstLetter = currency.title[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push({
          label: currency.title,
          value: currency.title,
        });
        return acc;
      }, {});
  }, [currencies]);

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
      name: 'quantity',
      label: 'Кількість',
      placeholder: 'Наприклад "1"',
      required: true,
    },
    {
      name: 'unitPrice',
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
      label: 'Одиниця вимірів',
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
      type: 'autocomplete',
      options: groupedCurrencies,
      placeholder: 'Наприклад "Українська гривня"',
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
