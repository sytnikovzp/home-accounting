## Конфігураційні змінні в '.env'

Створіть в кореневому каталогу проєкту файл конфігурації `.env`

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

### Контролер Аутентифікації

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>
  
Цей контролер відповідає за реєстрацію, авторизацію та відновлення паролю користувача. Токен має передаватися у заголовку Authorization у форматі Bearer Token.

#### 1. Реєстрація користувача

**Метод**: POST  
**URL**: `/api/auth/registration`  
**Опис**: Створює нового користувача.

**Тіло запиту**:

<pre><code>{
  "fullName": "повне ім'я користувача",
  "email": "email користувача",
  "password": "пароль"
}
</code></pre>

**Відповідь**:

<pre><code>{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "uuid користувача",
    "fullName": "повне ім'я користувача",
    "emailConfirmed": "статус підтвердження email користувача",
    "role": "роль користувача",
    "photo": "фото користувача (якщо є)"
  },
  "permissions": ["дозвіл_користувача1", "дозвіл_користувача2"]
}
</code></pre>

#### 2. Логін користувача

**Метод**: POST  
**URL**: `/api/auth/login`  
**Опис**: Логін користувача, видає JWT токени.

**Тіло запиту**:

<pre><code>{
  "email": "email користувача",
  "password": "пароль"
}
</code></pre>

**Відповідь**:

<pre><code>{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "uuid користувача",
    "fullName": "повне ім'я користувача",
    "emailConfirmed": "статус підтвердження email користувача",
    "role": "роль користувача",
    "photo": "фото користувача (якщо є)"
  },
  "permissions": ["дозвіл_користувача1", "дозвіл_користувача2"]
}
</code></pre>

#### 3. Логаут користувача

**Метод**: GET  
**URL**: `/api/auth/logout`  
**Опис**: Видаляє refresh токен і завершує сесію користувача.  
**Тіло запиту**: не потрібне.  
**Відповідь**: 200 OK

#### 4. Оновлення токенів (Refresh)

**Метод**: GET  
**URL**: `/api/auth/refresh`  
**Опис**: Оновлює JWT токени, використовуючи refresh токен з cookies.  
**Тіло запиту**: не потрібне.

**Відповідь**:

<pre><code>{
  "accessToken": "JWT access токен",
  "refreshToken": "JWT refresh токен",
  "user": {
    "uuid": "uuid користувача",
    "fullName": "повне ім'я користувача",
    "emailConfirmed": "статус підтвердження email користувача",
    "role": "роль користувача",
    "photo": "фото користувача (якщо є)"
  },
  "permissions": ["дозвіл_користувача1", "дозвіл_користувача2"]
}
</code></pre>

#### 5. Запит на скидання паролю

**Метод**: POST  
**URL**: `/api/auth/forgot`  
**Опис**: Відправляє на електронну пошту користувача посилання для скидання пароля.

**Тіло запиту**:

<pre><code>{
  "email": "email користувача"
}
</code></pre>

**Відповідь**:

<pre><code>{
  "severity": "success",
  "title": "Скидання паролю..."
  "message": "На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями",
}
</code></pre>

#### 6. Перенаправлення на сторінку для скидання паролю

**Метод**: GET  
**URL**: `/api/auth/reset-password`  
**Опис**: Перевіряє токен для скидання пароля і перенаправляє користувача на сторінку введення нового пароля.  
**Тіло запиту**: не потрібне.

**Відповідь**:

<pre><code>301 Redirect</code></pre>

#### 7. Скидання паролю

**Метод**: POST  
**URL**: `/api/auth/reset?token={uuid_token}`  
**Опис**: Скидає пароль користувача за допомогою токена для скидання пароля.

**Тіло запиту**:

<pre><code>{
  "newPassword": "новий пароль",
  "confirmNewPassword": "підтвердження нового паролю"
}
</code></pre>

**Відповідь**:

<pre><code>{
  "severity": "success",
  "title": "Скидання паролю..."
  "message": "Ваш пароль успішно змінено",
}
</code></pre>

</details>
