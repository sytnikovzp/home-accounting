export const FORM_RENDER_FIELDS = {
  categoryFields: [
    {
      name: 'title',
      label: 'Назва категорії',
      placeholder: 'Наприклад "Електроніка"',
      required: true,
      autoFocus: true,
    },
  ],
  currencyFields: [
    {
      name: 'title',
      label: 'Назва валюти',
      placeholder: 'Наприклад "Австралійський долар"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'code',
      label: 'Міжнародний код валюти',
      placeholder: 'Наприклад "AUD"',
      required: true,
    },
  ],
  establishmentFields: [
    {
      name: 'title',
      label: 'Назва закладу',
      placeholder: 'Наприклад "АТБ"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис закладу',
      placeholder: 'Наприклад "Один із найбільших..."',
    },
    {
      name: 'url',
      label: 'Веб сайт закладу',
      placeholder: 'Наприклад "https://www.atbmarket.com"',
    },
  ],
  roleFields: [
    {
      name: 'title',
      label: 'Назва ролі',
      placeholder: 'Наприклад "Admin"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис',
      placeholder: 'Наприклад "Адміністратори"',
    },
  ],
  measureFields: [
    {
      name: 'title',
      label: 'Назва одиниці вимірів',
      placeholder: 'Наприклад "кг"',
      required: true,
      autoFocus: true,
    },
    {
      name: 'description',
      label: 'Опис',
      placeholder: 'Наприклад "кілограм"',
      required: true,
    },
  ],
  loginFields: [
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
      autoFocus: true,
    },
    {
      name: 'password',
      label: 'Пароль',
      placeholder: 'Qwerty12',
      type: 'password',
    },
  ],
  registrationFields: [
    {
      name: 'fullName',
      label: 'Повне ім’я',
      placeholder: 'Іван Іванов',
      autoFocus: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
    },
    {
      name: 'password',
      label: 'Пароль',
      placeholder: 'Qwerty12',
      type: 'password',
    },
  ],
  forgotPasswordFields: [
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'example@gmail.com',
      autoFocus: true,
    },
  ],
  changePasswordFields: [
    {
      name: 'newPassword',
      label: 'Новий пароль',
      placeholder: 'Qwerty12',
      type: 'password',
      required: true,
      autoFocus: true,
    },
    {
      name: 'confirmNewPassword',
      label: 'Повтор нового паролю',
      placeholder: 'Qwerty12',
      type: 'password',
      required: true,
    },
  ],
  productFields: [
    {
      name: 'title',
      label: 'Назва товару/послуги',
      placeholder: 'Наприклад "Футболка"',
      required: true,
      autoFocus: true,
    },
  ],
};
