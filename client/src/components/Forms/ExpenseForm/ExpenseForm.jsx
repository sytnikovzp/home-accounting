import { useMemo } from 'react';
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
  const initialValues = useMemo(
    () => ({
      product: expense?.product?.title || '',
      quantity: expense?.quantity || '',
      unitPrice: expense?.unitPrice || '',
      establishment: expense?.establishment?.title || '',
      measure: expense?.measure?.title || '',
      currency: expense?.currency?.title || 'Українська гривня',
      date: expense?.date || format(new Date(), 'dd MMMM yyyy', { locale: uk }),
    }),
    [expense]
  );

  const groupedProducts = useMemo(
    () => groupByFirstLetter([...products], 'title', 'title'),
    [products]
  );

  const groupedCurrencies = useMemo(
    () => groupByFirstLetter([...currencies], 'title', 'title'),
    [currencies]
  );

  const groupedEstablishments = useMemo(
    () => groupByFirstLetter([...establishments], 'title', 'title'),
    [establishments]
  );

  const sortedMeasures = useMemo(
    () =>
      [...measures]
        .sort((a, b) => a.description.localeCompare(b.description))
        .map((measure) => ({
          value: measure.title,
          label: measure.description,
        })),
    [measures]
  );

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
      name: 'establishment',
      label: 'Заклад',
      type: 'autocomplete',
      options: groupedEstablishments,
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
      options: groupedCurrencies,
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
      submitButtonText={expense ? 'Зберегти зміни' : 'Додати витрату'}
      validationSchema={EXPENSE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ExpenseForm;
