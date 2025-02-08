const STATUS_OPTIONS = {
  users: [
    { label: 'Всі користувачі', value: 'all' },
    { label: 'Очікують веріфікації', value: 'pending' },
    { label: 'Веріфіковані', value: 'verified' },
  ],
  expenses: [
    { label: 'За останній день', value: 'day' },
    { label: 'За останній тиждень', value: 'week' },
    { label: 'За останній місяць', value: 'month' },
    { label: 'За останній рік', value: 'year' },
    { label: 'За весь час', value: 'allTime' },
  ],
  default: [
    { label: 'Очікує модерації', value: 'pending' },
    { label: 'Затверджено', value: 'approved' },
    { label: 'Відхилено', value: 'rejected' },
  ],
};

export { STATUS_OPTIONS };
