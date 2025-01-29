import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import { groupByFirstLetter } from '../../../utils/sharedFunctions';
import { EXPENSE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import BaseForm from '../BaseForm/BaseForm';

function ExpenseForm({
  isLoading,
  expense = null,
  onSubmit,
  products = [],
  establishments = [],
  measures = [],
  currencies = [],
}) {
  const {
    uuid,
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date,
  } = expense || {};

  const initialValues = {
    product: product?.title || '',
    quantity: quantity || '',
    unitPrice: unitPrice || '',
    establishment: establishment?.title || '',
    measure: measure?.title || '',
    currency: currency?.title || 'Українська гривня',
    date: date || format(new Date(), 'dd MMMM yyyy', { locale: uk }),
  };

  const groupedOptions = {
    products: groupByFirstLetter([...products], 'title', 'title'),
    currencies: groupByFirstLetter([...currencies], 'title', 'title'),
    establishments: groupByFirstLetter([...establishments], 'title', 'title'),
  };

  const sortedMeasures = [...measures]
    .sort((a, b) => a.description.localeCompare(b.description))
    .map((measure) => ({
      value: measure.title,
      label: measure.description,
    }));

  const fields = [
    {
      name: 'product',
      label: 'Товар',
      type: 'autocomplete',
      options: groupedOptions.products,
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
      name: 'establishment',
      label: 'Заклад',
      type: 'autocomplete',
      options: groupedOptions.establishments,
      placeholder: 'Наприклад "АТБ"',
      required: true,
    },
    {
      name: 'measure',
      label: 'Одиниця вимірів',
      type: 'select',
      options: sortedMeasures,
      placeholder: 'Наприклад "кг"',
      required: true,
    },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'autocomplete',
      options: groupedOptions.currencies,
      placeholder: 'Наприклад "Українська гривня"',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Дата витрати',
      placeholder: 'Наприклад "02 лютого 2025"',
      required: true,
    },
  ];

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      isLoading={isLoading}
      layout='expense'
      submitButtonText={uuid ? 'Зберегти зміни' : 'Додати витрату'}
      validationSchema={EXPENSE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ExpenseForm;
