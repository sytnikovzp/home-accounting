## Конфігураційні змінні в '.env'

Створіть в кореневому каталогу проєкту файл конфігурації `.env` та вкажіть свої параметри `SMTP_USER` та `SMTP_PASSWORD`:

```yaml
#For client
VITE_PORT=3000

#For server
ACCOUNTING_SERVER_HOST=localhost
ACCOUNTING_SERVER_PORT=5000

ACCESS_SECRET=access_secret
REFRESH_SECRET=refresh_secret
ACCESS_TOKEN_LIFETIME=15m
REFRESH_TOKEN_LIFETIME=60d

SALT_ROUNDS=9
STATIC_PATH=public
CLIENT_URL=http://localhost:3000

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=*yourmail@gmail.com*
SMTP_PASSWORD="*your password*"

#For database
DB_USER=postgres
DB_PASS=root
DB_NAME=home_accounting
DB_NAME_TEST=home_accounting_test
DB_DIALECT=postgres
MONGO_PORT=27017
MONGO_DB_NAME=home_accounting
MONGO_DB_NAME_TEST=home_accounting_test
```

# Документація API

Токен має передаватися у заголовку Authorization у форматі Bearer Token.

### Контролер Аутентифікації

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>
  
Цей контролер відповідає за реєстрацію, авторизацію та відновлення паролю користувача.

#### 1. Реєстрація користувача

**Метод**: POST  
**URL**: `/api/auth/registration`  
**Опис**: Створює нового користувача.

**Тіло запиту**:

```json
{
  "fullName": "Повне ім'я користувача",
  "email": "Email користувача",
  "password": "Пароль"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 2. Логін користувача

**Метод**: POST  
**URL**: `/api/auth/login`  
**Опис**: Логін користувача, видає JWT токени.

**Тіло запиту**:

```json
{
  "email": "Email користувача",
  "password": "Пароль"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 3. Логаут користувача

**Метод**: GET  
**URL**: `/api/auth/logout`  
**Опис**: Видаляє refresh токен і завершує сесію користувача.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 200 OK

---

#### 4. Оновлення токенів (Refresh)

**Метод**: GET  
**URL**: `/api/auth/refresh`  
**Опис**: Оновлює JWT токени, використовуючи refresh токен з cookies.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 5. Запит на скидання паролю

**Метод**: POST  
**URL**: `/api/auth/forgot`  
**Опис**: Відправляє на електронну пошту користувача посилання для скидання пароля.

**Тіло запиту**:

```json
{
  "email": "Email користувача"
}
```

**Приклад відповіді**:

```json
{
  "severity": "success",
  "title": "Скидання паролю..."
  "message": "На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями",
}
```

---

#### 6. Перенаправлення на сторінку для скидання паролю

**Метод**: GET  
**URL**: `/api/auth/reset-password`  
**Опис**: Перевіряє токен для скидання пароля і перенаправляє користувача на сторінку введення нового пароля.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 301 Redirect

---

#### 7. Скидання паролю

**Метод**: POST  
**URL**: `/api/auth/reset?token={uuid_token}`  
**Опис**: Скидає пароль користувача за допомогою токена для скидання пароля.

**Тіло запиту**:

```json
{
  "newPassword": "Новий пароль",
  "confirmNewPassword": "Підтвердження нового паролю"
}
```

**Приклад відповіді**:

```json
{
  "severity": "success",
  "title": "Скидання паролю..."
  "message": "Ваш пароль успішно змінено",
}
```

</details>

---

### Контролер Профілю Авторизованого Користувача

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління профілем поточного залогіненого користувача.

#### 1. Перегляд даних профілю поточного користувача

**Метод**: GET  
**URL**: `/api/profile`  
**Опис**: Отримує профіль поточного залогіненого користувача.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "uuid": "UUID поточного користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "UUID ролі користувача",
    "Назва ролі користувача"
  },
  "photo": "Фото користувача (якщо є)",
  "email": "Email користувача",
  "emailConfirm": "Статус підтвердження email користувача",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  },
  "permissions": [
    {
      "uuid": "UUID дозволу",
      "title": "НАЗВА_ДОЗВОЛУ"
    },
    ...
  ]
}
```

---

#### 2. Підтвердження email нового користувача

**Метод**: GET  
**URL**: `/api/profile/confirm?token={uuid_token}`  
**Опис**: Підтверджує email користувача за допомогою токена.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 301 Redirect

---

#### 3. Повторне відправлення посилання для підтвердження email

**Метод**: GET  
**URL**: `/api/profile/resend`  
**Опис**: Повторно надсилає лист для підтвердження email.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 301 Redirect

---

#### 4. Редагування даних профілю поточного користувача

**Метод**: PATCH  
**URL**: `/api/profile`  
**Опис**: Оновлює профіль поточного залогіненого користувача.

**Тіло запиту**:

```json
{
  "fullName": "Нове ім'я користувача",
  "email": "Новий email користувача (необов'язково)",
  "role": "Нова роль користувача (необов'язково)"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 5. Зміна пароля поточного користувача

**Метод**: PATCH  
**URL**: `/api/profile/password`  
**Опис**: Оновлює пароль поточного користувача.

**Тіло запиту**:

```json
{
  "newPassword": "Новий пароль",
  "confirmNewPassword": "Підтвердження нового пароля"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 6. Зміна фото користувача

**Метод**: PATCH  
**URL**: `/api/profile/photo`  
**Опис**: Оновлює аватар користувача.  
**Формат запиту**: FormData

**Тіло запиту**:

```json
{
  "photo": (файл зображення)
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": "Фото користувача"
}
```

---

#### 7. Видалення фото користувача

**Метод**: DELETE  
**URL**: `/api/profile/photo`  
**Опис**: Видаляє аватар користувача, повертаючи його до дефолтного.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": ""
}
```

---

#### 8. Видалення облікового запису користувача

**Метод**: DELETE  
**URL**: `/api/profile`  
**Опис**: Видаляє обліковий запис поточного користувача.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 200 OK

</details>

---

### Контролер Управління Користувачами

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління користувачами, редагування профілів, перегляд та видалення їхніх даних.

#### 1. Отримання списку всіх користувачів

**Метод**: GET  
**URL**: `/api/users`  
**Опис**: Повертає список користувачів з підтримкою пагінації, сортування та фільтрації за статусом.  
**Тіло запиту**: не потрібне.

**Параметри запиту**:

- `limit` - кількість елементів на сторінці (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `emailConfirm` - поле для фільтрації списку (за замовчуванням `all`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

**Приклад відповіді**:

```json
[
  {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "photo": "Фото користувача (якщо є)",
  },
  ...
]
```

---

#### 2. Перегляд даних користувача за UUID

**Метод**: GET  
**URL**: `/api/users/{uuid}`  
**Опис**: Отримує інформацію про користувача за його UUID. Потрібен дозвіл `FULL_PROFILE_VIEWER` або `LIMITED_PROFILE_VIEWER`.  
**Тіло запиту**: не потрібне.

**Приклад відповіді, якщо поточний залогінений користувач має дозвіл FULL_PROFILE_VIEWER**:

```json
{
  "uuid": "UUID користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "UUID ролі користувача",
    "Назва ролі користувача"
  },
  "photo": "Фото користувача (якщо є)",
  "email": "Email користувача",
  "emailConfirm": "Статус підтвердження email користувача",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  },
  "permissions": [
    {
      "uuid": "UUID дозволу",
      "title": "НАЗВА_ДОЗВОЛУ"
    },
    ...
  ]
}
```

**Приклад відповіді, якщо поточний залогінений користувач має дозвіл LIMITED_PROFILE_VIEWER**:

```json
{
  "uuid": "UUID користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "UUID ролі користувача",
    "Назва ролі користувача"
  },
  "photo": "Фото користувача (якщо є)",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  },
}
```

---

#### 3. Редагування даних користувача за UUID

**Метод**: PATCH  
**URL**: `/api/users/{uuid}`  
**Опис**: Оновлює інформацію про користувача за його UUID. Потрібен дозвіл `EDIT_USERS`.

**Тіло запиту**:

```json
{
  "fullName": "Нове ім'я користувача",
  "email": "Новий email користувача (необов'язково)",
  "role": "Нова роль користувача (необов'язково)"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 4. Зміна пароля поточного користувача за UUID

**Метод**: PATCH  
**URL**: `/api/users/{uuid}/password`  
**Опис**: Оновлює пароль облікового запису користувача за його UUID. Потрібен дозвіл `EDIT_USERS`.

**Тіло запиту**:

```json
{
  "newPassword": "Новий пароль",
  "confirmNewPassword": "Підтвердження нового пароля"
}
```

**Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "emailConfirm": "Статус підтвердження email користувача",
    "role": "Роль користувача",
    "photo": "Фото користувача (якщо є)"
  },
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

---

#### 5. Зміна фото користувача за UUID

**Метод**: PATCH  
**URL**: `/api/users/{uuid}/photo`  
**Опис**: Оновлює аватар користувача за його UUID. Потрібен дозвіл `EDIT_USERS`.  
**Формат запиту**: FormData

**Тіло запиту**:

```json
{
  "photo": (файл зображення)
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": "Фото користувача"
}
```

---

#### 6. Видалення фото користувача за UUID

**Метод**: DELETE  
**URL**: `/api/users/{uuid}/photo`  
**Опис**: Видаляє аватар користувача за його UUID, повертаючи його до дефолтного. Потрібен дозвіл `EDIT_USERS`.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": ""
}
```

---

#### 7. Видалення облікового запису користувача за UUID

**Метод**: DELETE  
**URL**: `/api/users/{uuid}`  
**Опис**: Видаляє користувача за UUID. Потрібен дозвіл `REMOVE_USERS`.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 200 OK

</details>

---

### Контролер Управління Ролями Користувачей

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління ролями користувачей, перегляд, створення, редагування та видалення ролей, зміна дозволів для ролей.

#### 1. Отримання списку всіх ролей

**Метод**: GET  
**URL**: `/api/roles`  
**Опис**: Повертає список ролей з підтримкою пагінації та сортування.  
**Тіло запиту**: не потрібне.

**Параметри запиту**:

- `limit` - кількість елементів на сторінці (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

**Приклад відповіді**:

```json
[
  {
    "uuid": "UUID ролі",
    "title": "Назва ролі",
  },
  ...
]
```

---

#### 2. Перегляд даних ролі за UUID

**Метод**: GET  
**URL**: `/api/roles/{uuid}`  
**Опис**: Отримує інформацію про роль за його UUID.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Назва ролі",
  "description": "Опис ролі (якщо є)",
  "permissions": [
    {
      "uuid": "UUID дозволу",
      "title": "НАЗВА_ДОЗВОЛУ",
      "description": "Детальний опис дозволу"
    },
    ...
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

---

#### 3. Створення нової ролі

**Метод**: POST  
**URL**: `/api/roles`  
**Опис**: Створює нову роль. Потрібен дозвіл `ADD_ROLES`.

**Тіло запиту**:

```json
{
  "title": "Назва ролі",
  "description": "Опис ролі (необов'язково)",
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Назва ролі",
  "description": "Опис ролі",
  "permissions": [
    {
      "uuid": "UUID дозволу",
      "title": "НАЗВА_ДОЗВОЛУ",
      "description": "Детальний опис дозволу"
    },
    ...
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

---

#### 4. Редагування даних ролі за UUID

**Метод**: PATCH  
**URL**: `/api/roles/{uuid}`  
**Опис**: Оновлює інформацію про роль за його UUID. Потрібен дозвіл `EDIT_ROLES`.

**Тіло запиту**:

```json
{
  "title": "Оновлена назва ролі (необов'язково)",
  "description": "Оновлений опис ролі (необов'язково)",
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Оновлена назва ролі",
  "description": "Оновлений опис ролі",
  "permissions": [
    {
      "uuid": "UUID дозволу",
      "title": "НАЗВА_ДОЗВОЛУ",
      "description": "Детальний опис дозволу"
    },
    ...
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

---

#### 5. Видалення ролі за UUID

**Метод**: DELETE  
**URL**: `/api/roles/{uuid}`  
**Опис**: Видаляє роль за UUID. Потрібен дозвіл `REMOVE_ROLES`.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 200 OK

</details>

---

### Контролер Управління Прав Доступу Користувачів

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління правами доступу користувачів.

#### 1. Отримання списку всіх прав доступу

**Метод**: GET  
**URL**: `/api/permissions`  
**Опис**: Повертає список всіх прав доступу.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
[
  {
    "uuid": "UUID дозволу",
    "title": "НАЗВА_ДОЗВОЛУ",
    "description": "Детальний опис дозволу"
  },
  ...
]
```

</details>

---

### Контролер Управління Категоріями Товарів

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління категоріями товарів, перегляд, створення, редагування та видалення категорій.

#### 1. Отримання списку всіх категорій

**Метод**: GET  
**URL**: `/api/categories`  
**Опис**: Повертає список категорій з підтримкою пагінації, сортування та фільтрації за статусом.  
**Тіло запиту**: не потрібне.

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `status` - поле для фільтрації списку (за замовчуванням `approved`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

**Приклад відповіді**:

```json
[
  {
    "uuid": "UUID категорії",
    "title": "Назва категорії"
  },
  ...
]
```

---

#### 2. Перегляд даних категорії за UUID

**Метод**: GET  
**URL**: `/api/categories/{uuid}`  
**Опис**: Отримує інформацію про категорію за його UUID.  
**Тіло запиту**: не потрібне.

**Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Назва категорії",
  "contentType": "Категорія",
  "status": "Статус модерації",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення категорії",
    "updatedAt": "Дата та час редагування категорії"
  }
}
```

---

#### 3. Створення нової категорії

**Метод**: POST  
**URL**: `/api/categories`  
**Опис**: Створює нову категорію. Потрібен дозвіл `ADD_CATEGORIES`.

**Тіло запиту**:

```json
{
  "title": "Нова категорія"
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Назва категорії",
  "contentType": "Категорія",
  "status": "Статус модерації",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення категорії",
    "updatedAt": "Дата та час редагування категорії"
  }
}
```

---

#### 4. Редагування даних категорії за UUID

**Метод**: PATCH  
**URL**: `/api/categories/{uuid}`  
**Опис**: Оновлює інформацію про категорію за його UUID. Потрібен дозвіл `EDIT_CATEGORIES` або `MODERATION_CATEGORIES`.

**Тіло запиту**:

```json
{
  "title": "Оновлена назва"
}
```

**Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Оновлена назва категорії",
  "contentType": "Категорія",
  "status": "Статус модерації",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення категорії",
    "updatedAt": "Дата та час редагування категорії"
  }
}
```

---

#### 5. Видалення категорії за UUID

**Метод**: DELETE  
**URL**: `/api/categories/{uuid}`  
**Опис**: Видаляє категорію за UUID. Потрібен дозвіл `REMOVE_CATEGORIES`.  
**Тіло запиту**: не потрібне.  
**Приклад відповіді**: 200 OK

</details>

---
