import { format } from 'date-fns';
import { uk } from 'date-fns/locale/uk';

import {
  formatItems,
  groupByFirstLetter,
} from '../../../utils/sharedFunctions';
import { EXPENSE_VALIDATION_SCHEME } from '../../../utils/validationSchemes';

import {
  useFetchAllCurrenciesQuery,
  useFetchAllEstablishmentsQuery,
  useFetchAllMeasuresQuery,
  useFetchAllProductsQuery,
} from '../../../store/services';

import Preloader from '../../Preloader/Preloader';
import BaseForm from '../BaseForm/BaseForm';

function ExpenseForm({ isSubmitting, expense = null, onSubmit }) {
  const {
    product,
    quantity,
    unitPrice,
    establishment,
    measure,
    currency,
    date,
  } = expense ?? {};

  const queries = [
    useFetchAllMeasuresQuery({ page: 1, limit: 500, sort: 'description' }),
    useFetchAllCurrenciesQuery({ page: 1, limit: 500, sort: 'title' }),
    useFetchAllEstablishmentsQuery({ page: 1, limit: 500, sort: 'title' }),
    useFetchAllProductsQuery({ page: 1, limit: 500, sort: 'title' }),
  ];

  const currencies = queries[1].data?.data ?? [];
  const establishments = queries[2].data?.data ?? [];
  const measures = queries[0].data?.data ?? [];
  const products = queries[3].data?.data ?? [];

  if (queries.some((query) => query.isLoading)) {
    return <Preloader />;
  }

  const initialValues = {
    product: product?.title || '',
    quantity: quantity || '',
    unitPrice: unitPrice || '',
    establishment: establishment?.title || '',
    measure: measure?.title || '',
    currency: currency?.title || 'Українська гривня',
    date: date || format(new Date(), 'dd MMMM yyyy', { locale: uk }),
  };

  const fields = [
    {
      name: 'product',
      label: 'Товар',
      type: 'autocomplete',
      options: groupByFirstLetter([...products], 'title', 'title'),
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
      label: 'Вартість за одиницю',
      placeholder: 'Наприклад "80"',
      required: true,
    },
    {
      name: 'establishment',
      label: 'Заклад',
      type: 'autocomplete',
      options: groupByFirstLetter([...establishments], 'title', 'title'),
      placeholder: 'Наприклад "АТБ"',
      required: true,
    },
    {
      name: 'measure',
      label: 'Одиниця вимірів',
      type: 'select',
      options: formatItems(measures, 'title', 'description'),
      placeholder: 'Наприклад "кг"',
      required: true,
    },
    {
      name: 'currency',
      label: 'Валюта',
      type: 'autocomplete',
      options: groupByFirstLetter([...currencies], 'title', 'title'),
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
      isSubmitting={isSubmitting}
      layout='expense'
      validationSchema={EXPENSE_VALIDATION_SCHEME}
      onSubmit={onSubmit}
    />
  );
}

export default ExpenseForm;
