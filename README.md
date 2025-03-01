# Home accounting (aka Моя бухгалтерія)

<p align="center">
  <img src="./screenshots/9_Expenses_edit.png" alt="Home Accounting" style="max-width: 80%;">
  <img src="https://img.shields.io/github/last-commit/sytnikovzp/home-accounting" alt="Last Commit">
</p>

## Опис додатку

Додаток для відстеження особистих фінансів. Дозволяє контролювати витрати та доходи. **Наразі перебуває в розробці**.

<details>
  <summary><strong>Основна функціональність додатку</strong></summary>

- **Реєстрація та Авторизація**: Користувачі можуть зареєструватися та увійти до системи, використовуючи свої облікові дані (логін/пароль). Всі роутери, що потребують авторизації, є приватними.

- **Адаптивний Дизайн**: Додаток має адаптивний дизайн, що забезпечує комфортне використання на різних пристроях.

- **Прелоадери**: Включені прелоадери для візуалізації процесу завантаження даних з API.

</details>

<details>
  <summary><strong>Скріншоти додатку</strong></summary>

![Auth](./screenshots/1_Auth.png)
![ForgotPass](./screenshots/2_Forgot_pass.png)
![UserList](./screenshots/3_User_list.png)
![ChangePass](./screenshots/4_Change_pass.png)
![RoleDetails](./screenshots/5_Role_details.png)

</details>

## Використані технології та біблиотеки

<details>
  <summary><strong>Серверні технології</strong></summary>

- **Node.js** – середовище виконання JavaScript на сервері.
- **Express** – веб-фреймворк для створення серверних застосунків. Забезпечує маршрутизацію та обробку запитів.
- **PostgreSQL** – реляційна база даних, що використовується для зберігання даних застосунку.
- **Sequelize** – ORM (Object-Relational Mapping) для роботи з базою даних PostgreSQL. Дозволяє взаємодіяти з базою даних через моделі, а також керувати міграціями та сидуванням даних.
- **pg** і **pg-hstore** – бібліотеки для взаємодії з PostgreSQL з використанням Sequelize.
- **MongoDB** – NoSQL база даних, яка використовується для зберігання користувачів, ролей і прав доступу.
- **Mongoose** – ODM (Object-Document Mapping) для роботи з MongoDB. Дозволяє створювати схеми та моделі для взаємодії з базою даних.
- **Axios** – бібліотека для виконання HTTP-запитів. Використовується для комунікації з сервером і API НБУ для завантаження курсів валют.
- **bcrypt** – бібліотека для хешування паролів, що використовується для підвищення безпеки даних користувачів.
- **jsonwebtoken** – бібліотека для роботи з JWT (JSON Web Token), яка використовується для авторизації та створення токенів доступу.
- **cookie-parser** – middleware для обробки файлів cookie в Express.
- **cors** – middleware для керування політикою доступу між доменами (CORS).
- **dotenv** – бібліотека для завантаження змінних оточення з `.env` файлу.
- **yup** – бібліотека для валідації даних на сервері.
- **multer** – middleware для обробки завантаження файлів на сервер (наприклад, зображень або документів).
- **nodemailer** – бібліотека для відправки email-листів через SMTP.
- **uuid** – бібліотека для генерації унікальних ідентифікаторів (UUID).
- **date-fns** – бібліотека для роботи з датами, що дозволяє форматувати, парсити та виконувати операції з датами.

</details>

<details>
  <summary><strong>Клієнтські технології</strong></summary>

- **React** – бібліотека для побудови інтерфейсів користувача. Використовується для створення компонентів і управління станом.
- **React DOM** – бібліотека для взаємодії React з DOM.
- **React Router DOM** – бібліотека для роботи з маршрутизацією в React. Використовується для організації навігації між сторінками.
- **Redux Toolkit** – набір інструментів для роботи з глобальним станом у Redux.
- **React Redux** – офіційна бібліотека для інтеграції Redux з React.
- **Redux Logger** – middleware для логування дій Redux у консолі.
- **MUI (Material-UI)** – бібліотека компонентів для React, що реалізує Material Design.
- **MUI Icons** – набір іконок для Material-UI.
- **MUI Date Pickers** – набір компонентів для вибору дати та часу.
- **Emotion (React & Styled)** – бібліотека для роботи зі стилями в React.
- **Chart.js** – бібліотека для створення графіків і діаграм.
- **React-Chartjs-2** – обгортка для інтеграції Chart.js з React.
- **Chart.js Plugin Datalabels** – плагін для Chart.js, що дозволяє відображати підписи на діаграмах.
- **Formik** – бібліотека для керування формами в React, що спрощує обробку стану, валідації та подій у формах.
- **Yup** – бібліотека для валідації даних на клієнті.
- **Date-fns** – бібліотека для роботи з датами, яка використовується для форматування і обробки часу.
- **React Helmet Async** – бібліотека для роботи з мета-тегами та заголовками сторінок в React.

</details>

<details>
  <summary><strong>Загальні для клієнта та сервера Dev Dependencies</strong></summary>

- **ESLint** – інструмент для аналізу коду, що допомагає дотримуватися кращих практик програмування.
- **ESLint Config Prettier** – конфігурація ESLint для сумісності з Prettier.
- **ESLint Plugins**:
  - **eslint-plugin-import** – перевіряє правильність імпорту модулів.
  - **eslint-plugin-jsx-a11y** – допомагає покращити доступність JSX-коду.
  - **eslint-plugin-no-secrets** – виявляє випадкове розміщення секретів (API-ключів, паролів) у коді.
  - **eslint-plugin-optimize-regex** – оптимізує регулярні вирази.
  - **eslint-plugin-prettier** – інтеграція Prettier з ESLint.
  - **eslint-plugin-promise** – забезпечує дотримання кращих практик при роботі з промісами.
  - **eslint-plugin-react** – лінтинг специфічного для React коду.
  - **eslint-plugin-react-hooks** – перевіряє коректне використання React-хуків.
  - **eslint-plugin-react-refresh** – підтримка React Fast Refresh.
  - **eslint-plugin-simple-import-sort** – автоматично сортує імпорти.
  - **eslint-plugin-sort-keys-fix** – автоматично сортує ключі об'єктів.
  - **eslint-plugin-sequelize** – перевіряє використання Sequelize у коді.
  - **eslint-plugin-unicorn** – набір правил для покращення якості коду.
- **Prettier** – інструмент для автоматичного форматування коду.
- **Globals** – набір глобальних змінних для коректної роботи ESLint.
- **Nodemon** – утиліта, що дозволяє автоматично перезапускати сервер при внесенні змін у код.
- **Morgan** – middleware для ведення логів HTTP-запитів в Express.
- **Sequelize CLI** – інструмент для керування міграціями та сидуванням даних у Sequelize.
- **Jest** – тестова бібліотека для модульного тестування.
- **Supertest** – бібліотека для тестування HTTP-запитів до сервера.
- **Vite** – інструмент для збірки проєктів, що забезпечує швидку розробку та оптимізацію коду.
- **Vite Plugin Env Compatible** – забезпечує сумісність змінних оточення у Vite.
- **@Vitejs/Plugin-React** – офіційний плагін для підтримки React у Vite.

</details>

## Схеми баз даних

<details>
  <summary><strong>PostgreSQL</strong></summary>
  <p align="center">
  <img src="./screenshots/ER_PostgreSQL.png" alt="PostgreSQL" style="max-width: 80%;">
  </p>
</details>

<details>
  <summary><strong>MongoDB</strong></summary>
  <p align="center">
  <img src="./screenshots/ER_MongoDB.png" alt="MongoDB" style="max-width: 80%;">
  </p>
</details>

## Розгортання проєкту

<details>
  <summary><strong>Підготовка</strong></summary>

```bash
# Клонуємо репозиторій
git clone git@github.com:sytnikovzp/home-accounting.git

# Переходимо в директорію проєкту
cd home-accounting

# Встановлюємо залежності для серверної та клієнтської частини
npm --prefix server install
npm --prefix client install
```

</details>

<details>
  <summary><strong>Налаштування конфігураційних змінних</strong></summary>

Створіть файл `.env` використовуючи команду:

```bash
cp .env.example .env
```

Відредагуйте файл `.env`, вказавши СВОЇ значення для `SMTP_USER` та `SMTP_PASSWORD`. Це потрібно для коректної роботи біблиотеки nodemailer.

Якщо файл `.env.example` відсутній, створіть файл `.env` використовуючи команду:

```bash
cat <<EOL > .env
# For client
VITE_PORT=3000

# For server
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

# For database
DB_USER=postgres
DB_PASS=root
DB_NAME=home_accounting
DB_NAME_TEST=home_accounting_test
DB_DIALECT=postgres
MONGO_PORT=27017
MONGO_DB_NAME=home_accounting
MONGO_DB_NAME_TEST=home_accounting_test
EOL
```

</details>

<details>
  <summary><strong>Ініціалізація баз даних</strong></summary>

```bash
cd server
npm run dbinit
cd ..
```

</details>

<details>
  <summary><strong>Запуск серверної частини (BackEnd)</strong></summary>

```bash
# В окремому терміналі переходимо в директорію проєкту
cd home-accounting

# Запускаємо BackEnd
npm --prefix server start
```

</details>

<details>
  <summary><strong>Запуск клієнтської частини (FrontEnd)</strong></summary>

```bash
# В окремому терміналі переходимо в директорію проєкту
cd home-accounting

# Запускаємо FrontEnd
npm --prefix client start
```

</details>

<details>
  <summary><strong>Завершення роботи</strong></summary>
  Для зупинки серверної або клієнтської частини в відповідному терміналі натисніть:

```bash
CTRL + C
```

</details>

---

## Документація API

### Аутентифікація

Цей контролер відповідає за реєстрацію, авторизацію та відновлення паролю користувача.

<details>
  <summary><strong>Реєстрація користувача</strong></summary>

- **Метод**: POST
- **URL**: `/api/auth/registration`
- **Опис**: Створює нового користувача
- **Доступ лише для авторизованих користувачів**: Ні

#### **Тіло запиту**:

```json
{
  "fullName": "Микола Щербак",
  "email": "m.scherbak93801@gmail.com",
  "password": "Qwerty12"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Микола Щербак",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Логін користувача</strong></summary>

- **Метод**: POST
- **URL**: `/api/auth/login`
- **Опис**: Авторизація користувача та отримання JWT-токенів
- **Доступ лише для авторизованих користувачів**: Ні

#### **Тіло запиту**:

```json
{
  "email": "m.scherbak93801@gmail.com",
  "password": "Qwerty12"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Микола Щербак",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Логаут користувача</strong></summary>

- **Метод**: GET
- **URL**: `/api/auth/logout`
- **Опис**: Видаляє refresh токен і завершує сесію користувача
- **Доступ лише для авторизованих користувачів**: Ні
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

<details>
  <summary><strong>Оновлення токенів (Refresh)</strong></summary>

- **Метод**: GET
- **URL**: `/api/auth/refresh`
- **Опис**: Оновлює JWT токени, використовуючи refresh токен з cookies
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Микола Щербак",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Запит на відновлення паролю</strong></summary>

- **Метод**: POST
- **URL**: `/api/auth/forgot`
- **Опис**: Відправляє на електронну пошту користувача посилання для скидання пароля
- **Доступ лише для авторизованих користувачів**: Ні

#### **Тіло запиту**:

```json
{
  "email": "m.scherbak93801@gmail.com"
}
```

#### **Приклад відповіді**:

```json
{
  "severity": "success",
  "title": "Відновлення паролю...",
  "message": "На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями"
}
```

</details>

<details>
  <summary><strong>Перенаправлення на сторінку для відновлення паролю</strong></summary>

- **Метод**: GET
- **URL**: `/api/auth/redirect`
- **Опис**: Перевіряє токен для скидання пароля і перенаправляє користувача на сторінку введення нового пароля
- **Доступ лише для авторизованих користувачів**: Ні
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `301 Redirect`

</details>

<details>
  <summary><strong>Відновлення паролю</strong></summary>

- **Метод**: POST
- **URL**: `/api/auth/reset?token={uuid_token}`
- **Опис**: Скидає пароль користувача за допомогою токена для скидання пароля
- **Доступ лише для авторизованих користувачів**: Ні

#### **Тіло запиту**:

```json
{
  "newPassword": "Qwerty12",
  "confirmNewPassword": "Qwerty12"
}
```

#### **Приклад відповіді**:

```json
{
  "severity": "success",
  "title": "Відновлення паролю...",
  "message": "Ваш пароль успішно змінено"
}
```

</details>

---

### Профіль Авторизованого Користувача

Цей контролер відповідає за управління профілем поточного залогіненого користувача.

<details>
  <summary><strong>Перегляд даних профілю поточного користувача</strong></summary>

- **Метод**: GET
- **URL**: `/api/profile`
- **Опис**: Отримує профіль поточного залогіненого користувача
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID поточного користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "UUID ролі користувача",
    "Назва ролі користувача"
  },
  "photo": "Ім'я файлу фото користувача (якщо є)",
  "email": "Email користувача",
  "emailConfirm": "Статус підтвердження email користувача",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  },
  "permissions": [
    {
      "uuid": "UUID права доступу",
      "title": "НАЗВА_ПРАВА_ДОСТУПУ"
    },
    ...
  ]
}
```

</details>

<details>
  <summary><strong>Підтвердження email користувача</strong></summary>

- **Метод**: GET
- **URL**: `/api/profile/confirm?token={uuid_token}`
- **Опис**: Підтверджує email користувача за допомогою токена
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `301 Redirect`

</details>

<details>
  <summary><strong>Повторне відправлення листа з посиланням для підтвердження</strong></summary>

- **Метод**: GET
- **URL**: `/api/profile/resend`
- **Опис**: Повторно надсилає лист для підтвердження email
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `301 Redirect`

</details>

<details>
  <summary><strong>Редагування даних профілю поточного користувача</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/profile`
- **Опис**: Оновлює профіль поточного залогіненого користувача
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "fullName": "Євген Коваленко",
  "email": "new_mail@gmail.com (необов'язково)",
  "role": "Administrators (необов'язково)"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Євген Коваленко",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Зміна пароля поточного користувача</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/profile/password`
- **Опис**: Оновлює пароль поточного користувача
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "newPassword": "Qwerty12",
  "confirmNewPassword": "Qwerty12"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Євген Коваленко",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Зміна фото поточного користувача</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/profile/photo`
- **Опис**: Оновлює аватар користувача
- **Доступ лише для авторизованих користувачів**: Так
- **Формат запиту**: FormData

#### **Тіло запиту**:

```json
{
  "photo": "(файл зображення)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": "1730713568386-evgen.kovalenko.jpg"
}
```

</details>

<details>
  <summary><strong>Видалення фото поточного користувача</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/profile/photo`
- **Опис**: Видаляє аватар користувача, повертаючи його до дефолтного
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": ""
}
```

</details>

<details>
  <summary><strong>Видалення облікового запису поточного користувача</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/profile`
- **Опис**: Видаляє обліковий запис поточного користувача
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Користувачами

Цей контролер відповідає за управління користувачами, редагування профілів, перегляд та видалення їхніх даних.

<details>
  <summary><strong>Отримання списку всіх користувачів</strong></summary>

- **Метод**: GET
- **URL**: `/api/users`
- **Опис**: Повертає список користувачів з підтримкою пагінації, сортування та фільтрації за статусом
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінці (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `emailConfirm` - поле для фільтрації списку (за замовчуванням `all`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID користувача",
    "fullName": "Повне ім'я користувача",
    "photo": "Ім'я файлу фото користувача (якщо є)",
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних користувача за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/users/{uuid}`
- **Опис**: Отримує інформацію про користувача за його UUID. Потрібні права доступу `FULL_PROFILE_VIEWER` або `LIMITED_PROFILE_VIEWER`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді, якщо поточний залогінений користувач має дозвіл FULL_PROFILE_VIEWER**:

```json
{
  "uuid": "UUID користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "uuid": "UUID ролі користувача",
    "title": "Назва ролі користувача"
  },
  "photo": "Ім'я файлу фото користувача (якщо є)",
  "email": "Email користувача",
  "emailConfirm": "Статус підтвердження email користувача",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  },
  "permissions": [
    {
      "uuid": "UUID права доступу",
      "title": "НАЗВА_ПРАВА_ДОСТУПУ"
    },
    ...
  ]
}
```

#### **Приклад відповіді, якщо поточний залогінений користувач має дозвіл LIMITED_PROFILE_VIEWER**:

```json
{
  "uuid": "UUID користувача",
  "fullName": "Повне ім'я користувача",
  "role": {
    "uuid": "UUID ролі користувача",
    "title": "Назва ролі користувача"
  },
  "photo": "Ім'я файлу фото користувача (якщо є)",
  "creation": {
    "createdAt": "Дата та час створення облікового запису",
    "updatedAt": "Дата та час редагування облікового запису"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних користувача за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/users/{uuid}`
- **Опис**: Оновлює інформацію про користувача за його UUID. Потрібні права доступу `EDIT_USERS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "fullName": "Євген Коваленко",
  "email": "new_mail@gmail.com (необов'язково)",
  "role": "Administrators (необов'язково)"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Євген Коваленко",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Зміна пароля користувача за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/users/{uuid}/password`
- **Опис**: Оновлює пароль облікового запису користувача за його UUID. Потрібні права доступу `EDIT_USERS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "newPassword": "Qwerty12",
  "confirmNewPassword": "Qwerty12"
}
```

#### **Приклад відповіді**:

```json
{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "UUID користувача",
    "fullName": "Євген Коваленко",
    "emailConfirm": "Очікує підтвердження",
    "role": "Users",
    "photo": ""
  },
  "permissions": ["ADD_ESTABLISHMENTS", "EDIT_ESTABLISHMENTS"]
}
```

</details>

<details>
  <summary><strong>Зміна фото користувача за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/users/{uuid}/photo`
- **Опис**: Оновлює аватар користувача за його UUID. Потрібні права доступу `EDIT_USERS`
- **Доступ лише для авторизованих користувачів**: Так
- **Формат запиту**: FormData

#### **Тіло запиту**:

```json
{
  "photo": "(файл зображення)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": "1730713568386-evgen.kovalenko.jpg"
}
```

</details>

<details>
  <summary><strong>Видалення фото користувача за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/users/{uuid}/photo`
- **Опис**: Видаляє аватар користувача за його UUID, повертаючи його до дефолтного. Потрібні права доступу `EDIT_USERS`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID користувача",
  "photo": ""
}
```

</details>

<details>
  <summary><strong>Видалення облікового запису користувача за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/users/{uuid}`
- **Опис**: Видаляє користувача за UUID. Потрібні права доступу `REMOVE_USERS`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Ролями Користувачів

Цей контролер відповідає за управління ролями користувачів, перегляд, створення, редагування та видалення ролей, зміна дозволів для ролей.

<details>
  <summary><strong>Отримання списку всіх ролей</strong></summary>

- **Метод**: GET
- **URL**: `/api/roles`
- **Опис**: Повертає список ролей з підтримкою пагінації та сортування
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінці (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID ролі",
    "title": "Назва ролі",
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних ролі за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/roles/{uuid}`
- **Опис**: Отримує інформацію про роль за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Назва ролі",
  "description": "Опис ролі (якщо є)",
  "permissions": [
    {
      "uuid": "UUID права доступу",
      "title": "НАЗВА_ПРАВА_ДОСТУПУ",
      "description": "Детальний опис права доступу"
    },
    ...
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

</details>

<details>
  <summary><strong>Створення нової ролі</strong></summary>

- **Метод**: POST
- **URL**: `/api/roles`
- **Опис**: Створює нову роль. Потрібні права доступу `ADD_ROLES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Нова роль користувача",
  "description": "Опис ролі (необов'язково)",
  "permissions": ["ADD_CATEGORIES", "ADD_PRODUCTS"]
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Нова роль користувача",
  "description": "Опис ролі",
  "permissions": [
    {
      "uuid": "UUID права доступу",
      "title": "ADD_CATEGORIES",
      "description": "Додавання нових товарів"
    },
    {
      "uuid": "UUID права доступу",
      "title": "ADD_PRODUCTS",
      "description": "Додавання товарів та послуг"
    },
    ...
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних ролі за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/roles/{uuid}`
- **Опис**: Оновлює інформацію про роль за його UUID. Потрібні права доступу `EDIT_ROLES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Оновлена назва ролі користувача",
  "description": "Оновлений опис ролі користувача",
  "permissions": ["EDIT_ESTABLISHMENTS"]
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID ролі",
  "title": "Оновлена назва ролі користувача",
  "description": "Оновлений опис ролі користувача",
  "permissions": [
    {
      "uuid": "UUID права доступу",
      "title": "EDIT_ESTABLISHMENTS",
      "description": "Редагування закладів"
    }
  ],
  "creation": {
    "createdAt": "Дата та час створення ролі",
    "updatedAt": "Дата та час редагування ролі"
  }
}
```

</details>

<details>
  <summary><strong>Видалення ролі за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/roles/{uuid}`
- **Опис**: Видаляє роль за UUID. Потрібні права доступу `REMOVE_ROLES`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Правами Доступу Користувачів

Цей контролер відповідає за управління правами доступу користувачів.

<details>
  <summary><strong>Отримання списку всіх прав доступу</strong></summary>

- **Метод**: GET
- **URL**: `/api/permissions`
- **Опис**: Повертає список всіх прав доступу
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID права доступу",
    "title": "НАЗВА_ПРАВА_ДОСТУПУ",
    "description": "Детальний опис права доступу"
  },
  ...
]
```

</details>

---

### Управління Категоріями Товарів

Цей контролер відповідає за управління категоріями товарів, перегляд, створення, редагування та видалення категорій.

<details>
  <summary><strong>Отримання списку всіх категорій</strong></summary>

- **Метод**: GET
- **URL**: `/api/categories`
- **Опис**: Повертає список категорій з підтримкою пагінації, сортування та фільтрації за статусом
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `status` - поле для фільтрації списку (за замовчуванням `approved`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID категорії",
    "title": "Назва категорії"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних категорії за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/categories/{uuid}`
- **Опис**: Отримує інформацію про категорію за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

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

</details>

<details>
  <summary><strong>Створення нової категорії</strong></summary>

- **Метод**: POST
- **URL**: `/api/categories`
- **Опис**: Створює нову категорію. Потрібні права доступу `ADD_CATEGORIES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Нова категорія"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Нова категорія",
  "contentType": "Категорія",
  "status": "Затверджено",
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

</details>

<details>
  <summary><strong>Редагування даних категорії за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/categories/{uuid}`
- **Опис**: Оновлює інформацію про категорію за його UUID. Потрібні права доступу `EDIT_CATEGORIES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Оновлена назва категорії"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Оновлена назва категорії",
  "contentType": "Категорія",
  "status": "Затверджено",
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

</details>

<details>
  <summary><strong>Видалення категорії за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/categories/{uuid}`
- **Опис**: Видаляє категорію за UUID. Потрібні права доступу `REMOVE_CATEGORIES`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Товарами та Послугами

Цей контролер відповідає за управління товарами та послугами, перегляд, створення, редагування та видалення товарів та послуг.

<details>
  <summary><strong>Отримання списку всіх товарів та послуг</strong></summary>

- **Метод**: GET
- **URL**: `/api/products`
- **Опис**: Повертає список товарів та послуг з підтримкою пагінації, сортування та фільтрації за статусом
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `status` - поле для фільтрації списку (за замовчуванням `approved`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID товару/послуги",
    "title": "Назва товару/послуги",
    "category": "Категорія товару/послуги (якщо є)"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних товару/послуги за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/products/{uuid}`
- **Опис**: Отримує інформацію про товар/послугу за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID товару/послуги",
  "title": "Назва товару/послуги",
  "contentType": "Товар",
  "status": "Статус модерації",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення товару/послуги",
    "updatedAt": "Дата та час редагування товару/послуги"
  },
  "category": {
    "uuid": "UUID категорії товару/послуги",
    "title": "Назва категорії товару/послуги"
  }
}
```

</details>

<details>
  <summary><strong>Створення нового товару/послуги</strong></summary>

- **Метод**: POST
- **URL**: `/api/products`
- **Опис**: Створює новий товар/послугу. Потрібні права доступу `ADD_PRODUCTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Новий товар",
  "category": "Категорія товару (необов'язково)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID товару/послуги",
  "title": "Новий товар",
  "contentType": "Товар",
  "status": "Очікує модерації",
  "moderation": {
    "moderatorUuid": "",
    "moderatorFullName": ""
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення товару/послуги",
    "updatedAt": "Дата та час редагування товару/послуги"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних товару/послуги за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/products/{uuid}`
- **Опис**: Оновлює інформацію про товар/послугу за його UUID. Потрібні права доступу `EDIT_PRODUCTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Оновлена назва товару",
  "category": "Категорія товару/послуги (необов'язково)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID товару/послуги",
  "title": "Оновлена назва товару",
  "contentType": "Товар",
  "status": "Очікує модерації",
  "moderation": {
    "moderatorUuid": "",
    "moderatorFullName": ""
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення товару/послуги",
    "updatedAt": "Дата та час редагування товару/послуги"
  }
}
```

</details>

<details>
  <summary><strong>Видалення товару/послуги за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/products/{uuid}`
- **Опис**: Видаляє товар/послугу за UUID. Потрібні права доступу `REMOVE_PRODUCTS`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Закладами

Цей контролер відповідає за управління закладами, перегляд, створення, редагування та видалення закладів.

<details>
  <summary><strong>Отримання списку всіх закладів</strong></summary>

- **Метод**: GET
- **URL**: `/api/establishments`
- **Опис**: Повертає список закладів з підтримкою пагінації, сортування та фільтрації за статусом
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `status` - поле для фільтрації списку (за замовчуванням `approved`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID закладу",
    "title": "Назва закладу",
    "logo": "Ім'я файлу логотипу закладу (якщо є)"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних закладу за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/establishments/{uuid}`
- **Опис**: Отримує інформацію про заклад за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "Назва закладу",
  "contentType": "Заклад",
  "description": "Опис закладу (якщо є)",
  "url": "Посилання на сайт закладу (якщо є)",
  "logo": "Ім'я файлу логотипу закладу (якщо є)",
  "status": "Статус модерації",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

<details>
  <summary><strong>Створення нового закладу</strong></summary>

- **Метод**: POST
- **URL**: `/api/establishments`
- **Опис**: Створює новий заклад. Потрібні права доступу `ADD_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Новий заклад",
  "description": "Опис закладу (необов'язково)",
  "url": "Посилання на сайт закладу (необов'язково)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "Новий заклад",
  "contentType": "Заклад",
  "description": "",
  "url": "",
  "logo": "",
  "status": "Затверджено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних закладу за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/establishments/{uuid}`
- **Опис**: Оновлює інформацію про заклад за його UUID. Потрібні права доступу `EDIT_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "АТБ",
  "description": "Заклад АТБ",
  "url": "https://www.atb.com.ua"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "АТБ",
  "contentType": "Заклад",
  "description": "Заклад АТБ",
  "url": "https://www.atb.com.ua",
  "logo": "",
  "status": "Затверджено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

<details>
  <summary><strong>Зміна логотипу закладу за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/establishments/{uuid}/logo`
- **Опис**: Оновлює логотип закладу за його UUID. Потрібні права доступу `EDIT_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так
- **Формат запиту**: FormData

#### **Тіло запиту**:

```json
{
  "logo": "(файл зображення)"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "АТБ",
  "contentType": "Заклад",
  "description": "Заклад АТБ",
  "url": "https://www.atb.com.ua",
  "logo": "1730713465136-atb.png",
  "status": "Затверджено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

<details>
  <summary><strong>Видалення логотипу закладу за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/establishments/{uuid}/logo`
- **Опис**: Видаляє логотип закладу за його UUID, повертаючи його до дефолтного. Потрібні права доступу `EDIT_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "АТБ",
  "contentType": "Заклад",
  "description": "Заклад АТБ",
  "url": "https://www.atb.com.ua",
  "logo": "",
  "status": "Затверджено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

<details>
  <summary><strong>Видалення закладу за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/establishments/{uuid}`
- **Опис**: Видаляє заклад за UUID. Потрібні права доступу `REMOVE_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Витратами

Цей контролер відповідає за управління витратами, перегляд, створення, редагування та видалення витрат.

<details>
  <summary><strong>Отримання списку всіх витрат</strong></summary>

- **Метод**: GET
- **URL**: `/api/expenses`
- **Опис**: Повертає список витрат з підтримкою пагінації, сортування та фільтрації за періодом. Кожен користувач може переглядати ТІЛЬКИ СВОЇ записи
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `ago` - поле для фільтрації списку (за замовчуванням `allTime`)
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID витрати",
    "date": "Дата здійснення витрати",
    "product": "Назва товару/послуги",
    "establishment": "Назва закладу"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних витрати за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/expenses/{uuid}`
- **Опис**: Отримує інформацію про витрату за його UUID. Кожен користувач може переглядати ТІЛЬКИ СВОЇ записи
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID витрати",
  "product": {
    "uuid": "UUID товару/послуги",
    "title": "Назва товару/послуги"
  },
  "quantity": "Кількість одиниць",
  "unitPrice": "Вартість за одиницю",
  "totalPrice": "Загальна вартість витрати",
  "establishment": {
    "uuid": "UUID закладу",
    "title": "Назва закладу"
  },
  "measure": {
    "uuid": "UUID одиниці вимірів",
    "title": "Назва одиниці вимірів"
  },
  "currency": {
    "uuid": "UUID валюти",
    "title": "Назва валюти",
    "code": "Міжнародний код валюти"
  },
  "date": "Дата здійснення витрати",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення витрати",
    "updatedAt": "Дата та час редагування витрати"
  }
}
```

</details>

<details>
  <summary><strong>Створення нової витрати</strong></summary>

- **Метод**: POST
- **URL**: `/api/expenses`
- **Опис**: Створює нову витрату. Потрібні права доступу `ADD_EXPENSES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "product": "Навушники",
  "quantity": "2",
  "measure": "шт",
  "unitPrice": "500",
  "currency": "Українська гривня",
  "establishment": "Comfy",
  "date": "12 січня 2025"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID витрати",
  "product": {
    "uuid": "UUID товару/послуги",
    "title": "Навушники"
  },
  "quantity": "2",
  "unitPrice": "500",
  "totalPrice": "1000",
  "establishment": {
    "uuid": "UUID закладу",
    "title": "Comfy"
  },
  "measure": {
    "uuid": "UUID одиниці вимірів",
    "title": "шт"
  },
  "currency": {
    "uuid": "UUID валюти",
    "title": "Українська гривня"
  },
  "date": "12 січня 2025",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення витрати",
    "updatedAt": "Дата та час редагування витрати"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних витрати за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/expenses/{uuid}`
- **Опис**: Оновлює інформацію про витрату за його UUID. Кожен користувач може редагувати ТІЛЬКИ СВОЇ записи. Потрібні права доступу `EDIT_EXPENSES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "product": "Ноутбук",
  "quantity": "1",
  "measure": "шт",
  "unitPrice": "850",
  "currency": "Долар США",
  "establishment": "Епіцентр",
  "date": "15 січня 2025"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID витрати",
  "product": {
    "uuid": "UUID товару/послуги",
    "title": "Ноутбук"
  },
  "quantity": "1",
  "unitPrice": "35471.86",
  "totalPrice": "35471.86",
  "establishment": {
    "uuid": "UUID закладу",
    "title": "Епіцентр"
  },
  "measure": {
    "uuid": "UUID одиниці вимірів",
    "title": "шт"
  },
  "currency": {
    "uuid": "UUID валюти",
    "title": "Українська гривня"
  },
  "date": "15 січня 2025",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення витрати",
    "updatedAt": "Дата та час редагування витрати"
  }
}
```

</details>

<details>
  <summary><strong>Видалення витрати за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/expenses/{uuid}`
- **Опис**: Видаляє витрату за UUID. Кожен користувач може видаляти ТІЛЬКИ СВОЇ записи. Потрібні права доступу `REMOVE_EXPENSES`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Валютами

Цей контролер відповідає за управління валютами, перегляд, створення, редагування та видалення валют.

<details>
  <summary><strong>Отримання списку всіх валют</strong></summary>

- **Метод**: GET
- **URL**: `/api/currencies`
- **Опис**: Повертає список валют з підтримкою пагінації та сортування
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID валюти",
    "title": "Назва валюти",
    "code": "Міжнародний код валюти"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних валюти за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/currencies/{uuid}`
- **Опис**: Отримує інформацію про валюту за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID валюти",
  "title": "Назва валюти",
  "code": "Міжнародний код валюти",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення валюти",
    "updatedAt": "Дата та час редагування валюти"
  }
}
```

</details>

<details>
  <summary><strong>Створення нової валюти</strong></summary>

- **Метод**: POST
- **URL**: `/api/currencies`
- **Опис**: Створює нову валюту. Потрібні права доступу `ADD_CURRENCIES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Нова валюта",
  "code": "TST"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID валюти",
  "title": "Нова валюта",
  "code": "TST",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення валюти",
    "updatedAt": "Дата та час редагування валюти"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних валюти за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/currencies/{uuid}`
- **Опис**: Оновлює інформацію про валюту за його UUID. Потрібні права доступу `EDIT_CURRENCIES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Оновлена валюта",
  "code": "TSS"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID валюти",
  "title": "Оновлена валюта",
  "code": "TSS",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення валюти",
    "updatedAt": "Дата та час редагування валюти"
  }
}
```

</details>

<details>
  <summary><strong>Видалення валюти за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/currencies/{uuid}`
- **Опис**: Видаляє валюту за UUID. Потрібні права доступу `REMOVE_CURRENCIES`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Одиницями Вимірів

Цей контролер відповідає за управління одиницями вимірів, перегляд, створення, редагування та видалення одиниць.

<details>
  <summary><strong>Отримання списку всіх одиниць вимірів</strong></summary>

- **Метод**: GET
- **URL**: `/api/measures`
- **Опис**: Повертає список одиниць вимірів з підтримкою пагінації та сортування
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID одиниці вимірів",
    "title": "Назва одиниці вимірів",
    "description": "Опис одиниці вимірів"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Перегляд даних одиниці вимірів за UUID</strong></summary>

- **Метод**: GET
- **URL**: `/api/measures/{uuid}`
- **Опис**: Отримує інформацію про одиницю вимірів за його UUID
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID одиниці вимірів",
  "title": "Назва одиниці вимірів",
  "description": "Опис одиниці вимірів",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення одиниці вимірів",
    "updatedAt": "Дата та час редагування одиниці вимірів"
  }
}
```

</details>

<details>
  <summary><strong>Створення нової одиниці вимірів</strong></summary>

- **Метод**: POST
- **URL**: `/api/measures`
- **Опис**: Створює нову одиницю вимірів. Потрібні права доступу `ADD_MEASURES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Нова одиниця вимірів",
  "description": "Опис одиниці вимірів"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID одиниці вимірів",
  "title": "Нова одиниця вимірів",
  "description": "Опис одиниці вимірів",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення одиниці вимірів",
    "updatedAt": "Дата та час редагування одиниці вимірів"
  }
}
```

</details>

<details>
  <summary><strong>Редагування даних одиниці вимірів за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/measures/{uuid}`
- **Опис**: Оновлює інформацію про одиницю вимірів за його UUID. Потрібні права доступу `EDIT_MEASURES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "title": "Оновлена назва одиниці вимірів",
  "description": "Оновлений опис одиниці вимірів"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID одиниці вимірів",
  "title": "Оновлена назва одиниці вимірів",
  "description": "Оновлений опис одиниці вимірів",
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення одиниці вимірів",
    "updatedAt": "Дата та час редагування одиниці вимірів"
  }
}
```

</details>

<details>
  <summary><strong>Видалення одиниці вимірів за UUID</strong></summary>

- **Метод**: DELETE
- **URL**: `/api/measures/{uuid}`
- **Опис**: Видаляє одиницю вимірів за UUID. Потрібні права доступу `REMOVE_MEASURES`
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне
- **Приклад відповіді**: `200 OK`

</details>

---

### Управління Модераціями

Цей контролер відповідає за управління модераціями, перегляд, схвалення чи відхилення пропозицій.

<details>
  <summary><strong>Отримання списку всіх елементів, які побребують модерації</strong></summary>

- **Метод**: GET
- **URL**: `/api/moderation`
- **Опис**: Повертає список елементів, які потребують модерації, з підтримкою пагінації та сортування
- **Доступ лише для авторизованих користувачів**: Так
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `limit` - кількість елементів на сторінку (за замовчуванням 5)
- `offset` - кількість елементів, які потрібно пропустити
- `sort` - поле для сортування (за замовчуванням `uuid`)
- `order` - напрям сортування (`asc` або `desc`, за замовчуванням `asc`)

#### **Приклад відповіді**:

```json
[
  {
    "uuid": "UUID елемента модерації",
    "title": "Назва елемента модерації",
    "contentType": "Тип елемента модерації",
    "path": "Шлях елемента модерації"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Модерація категорій за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/moderation/categories/{uuid}`
- **Опис**: Оновлює інформацію про модерацію категорії за його UUID. Потрібні права доступу `MODERATION_CATEGORIES`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "status": "rejected"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID категорії",
  "title": "Книги",
  "status": "Відхилено",
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

</details>

<details>
  <summary><strong>Модерація товарів та послуг за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/moderation/products/{uuid}`
- **Опис**: Оновлює інформацію про модерацію товарів та послуг за його UUID. Потрібні права доступу `MODERATION_PRODUCTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "status": "approved"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID товару/послуги",
  "title": "Солодка вода",
  "status": "Затверджено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення товару/послуги",
    "updatedAt": "Дата та час редагування товару/послуги"
  }
}
```

</details>

<details>
  <summary><strong>Модерація закладів за UUID</strong></summary>

- **Метод**: PATCH
- **URL**: `/api/moderation/establishments/{uuid}`
- **Опис**: Оновлює інформацію про модерацію закладів за його UUID. Потрібні права доступу `MODERATION_ESTABLISHMENTS`
- **Доступ лише для авторизованих користувачів**: Так

#### **Тіло запиту**:

```json
{
  "status": "rejected"
}
```

#### **Приклад відповіді**:

```json
{
  "uuid": "UUID закладу",
  "title": "Сільпо",
  "status": "Відхилено",
  "moderation": {
    "moderatorUuid": "UUID модератора",
    "moderatorFullName": "Повне ім'я модератора"
  },
  "creation": {
    "creatorUuid": "UUID автора",
    "creatorFullName": "Повне ім'я автора",
    "createdAt": "Дата та час створення закладу",
    "updatedAt": "Дата та час редагування закладу"
  }
}
```

</details>

---

### Статистика Витрат

Цей контролер відповідає за надання статистики витрат по критеріям за період.

<details>
  <summary><strong>Отримання списку всіх витрат по категоріям за період</strong></summary>

- **Метод**: GET
- **URL**: `/api/statistics/categories`
- **Опис**: Повертає список витрат по категоріям за період по поточному користувачу (якщо користувач авторизований) або по всім користувачам
- **Доступ лише для авторизованих користувачів**: Ні
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `ago` - поле для фільтрації списку (за замовчуванням `allTime`)
- `creatorUuid` - поле для фільтрації списку (за замовчуванням `null`)

#### **Приклад відповіді**:

```json
[
  {
    "title": "Назва категорії",
    "result": "Сума витрат по категоріям за період"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Отримання списку всіх витрат по товарам та послугам за період</strong></summary>

- **Метод**: GET
- **URL**: `/api/statistics/products`
- **Опис**: Повертає список витрат по товарам та послугам за період по поточному користувачу (якщо користувач авторизований) або по всім користувачам
- **Доступ лише для авторизованих користувачів**: Ні
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `ago` - поле для фільтрації списку (за замовчуванням `allTime`)
- `creatorUuid` - поле для фільтрації списку (за замовчуванням `null`)

#### **Приклад відповіді**:

```json
[
  {
    "title": "Назва товару/послуги",
    "result": "Сума витрат по товарам/послугам за період"
  },
  ...
]
```

</details>

<details>
  <summary><strong>Отримання списку всіх витрат по закладам за період</strong></summary>

- **Метод**: GET
- **URL**: `/api/statistics/establishments`
- **Опис**: Повертає список витрат по закладам за період по поточному користувачу (якщо користувач авторизований) або по всім користувачам
- **Доступ лише для авторизованих користувачів**: Ні
- **Тіло запиту**: не потрібне

**Параметри запиту**:

- `ago` - поле для фільтрації списку (за замовчуванням `allTime`)
- `creatorUuid` - поле для фільтрації списку (за замовчуванням `null`)

#### **Приклад відповіді**:

```json
[
  {
    "title": "Назва закладу",
    "result": "Сума витрат по закладам за період"
  },
  ...
]
```

</details>
