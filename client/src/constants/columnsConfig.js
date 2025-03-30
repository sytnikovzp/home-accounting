export const COLUMNS_CONFIG = {
  categories: [
    { field: 'title', headerName: 'Назва категорії', align: 'left' },
  ],
  currencies: [{ field: 'title', headerName: 'Назва валюти', align: 'left' }],
  establishments: [
    { field: 'logo', headerName: 'Лого', align: 'center' },
    { field: 'title', headerName: 'Назва закладу', align: 'left' },
  ],
  expenses: [
    { field: 'date', headerName: 'Дата', align: 'left' },
    { field: 'product', headerName: 'Товар', align: 'left' },
    { field: 'establishment', headerName: 'Заклад', align: 'left' },
    { field: 'totalPrice', headerName: 'Сума (UAH)', align: 'left' },
  ],
  measures: [{ field: 'title', headerName: 'Назва одиниці', align: 'left' }],
  moderation: [
    { field: 'contentType', headerName: 'Тип контенту', align: 'left' },
    { field: 'title', headerName: 'Назва', align: 'left' },
  ],
  products: [
    { field: 'title', headerName: 'Назва товару/послуги', align: 'left' },
    { field: 'category', headerName: 'Категорія', align: 'left' },
  ],
  roles: [{ field: 'title', headerName: 'Назва ролі', align: 'left' }],
  users: [
    { field: 'photo', headerName: 'Фото', align: 'center' },
    { field: 'fullName', headerName: 'Повне ім`я', align: 'left' },
  ],
};
