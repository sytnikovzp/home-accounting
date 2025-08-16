import { formatItems, groupByFirstLetter } from '@/src/utils/selectHelpers';

const getCategoryField = (options) => ({
  name: 'category',
  label: 'Категорія товару/послуги',
  type: 'autocomplete',
  options,
  placeholder: 'Наприклад "Одяг"',
});

const getExpenseFormFields = ({
  products,
  establishments,
  measures,
  currencies,
}) => [
  {
    name: 'product',
    label: 'Товар/послуга',
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

export { getCategoryField, getExpenseFormFields };
