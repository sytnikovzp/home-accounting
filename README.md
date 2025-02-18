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
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
</code></pre>

---

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
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
</code></pre>

---

#### 3. Логаут користувача

**Метод**: GET  
**URL**: `/api/auth/logout`  
**Опис**: Видаляє refresh токен і завершує сесію користувача.  
**Тіло запиту**: не потрібне.  
**Відповідь**: 200 OK

---

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
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
</code></pre>

---

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

---

#### 6. Перенаправлення на сторінку для скидання паролю

**Метод**: GET  
**URL**: `/api/auth/reset-password`  
**Опис**: Перевіряє токен для скидання пароля і перенаправляє користувача на сторінку введення нового пароля.  
**Тіло запиту**: не потрібне.

**Відповідь**:

<pre><code>301 Redirect</code></pre>

---

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

### Контролер Профілю Користувача

<details>
  <summary><strong>Натисніть тут, щоб розгорнути</strong></summary>

Цей контролер відповідає за управління профілем поточного залогіненого користувача.

#### 1. Отримання профілю поточного користувача

**Метод**: GET  
**URL**: `/api/profile`  
**Опис**: Отримує профіль поточного залогіненого користувача.  
**Тіло запиту**: не потрібне.

**Відповідь**:

<pre><code>{
  "uuid": "uuid поточного користувача",
  "fullName": "повне ім'я користувача",
  "role": {
    "uuid ролі користувача",
    "назва ролі користувача"
  },
  "photo": "фото користувача (якщо є)",
  "email": "email користувача",
  "emailConfirmed": "статус підтвердження email користувача",
  "creation": {
    "createdAt": "дата та час створення облікового запису",
    "updatedAt": "дата та час редагування облікового запису"
  },
  "permissions": [
    {
      "uuid": "uuid дозволу",
      "title": "НАЗВА_ДОЗВОЛУ"
    }, 
    {
      "uuid": "uuid дозволу",
      "title": "НАЗВА_ДОЗВОЛУ"
    }, 
    ...
  ]
}
</code></pre>

---

#### 2. Підтвердження email нового користувача

**Метод**: GET  
**URL**: `/api/profile/confirm?token={uuid_token}`  
**Опис**: Підтверджує email користувача за допомогою токена.  
**Тіло запиту**: не потрібне.  
**Відповідь**: 301 Redirect

---

#### 3. Повторне відправлення підтвердження email

**Метод**: GET  
**URL**: `/api/profile/resend`  
**Опис**: Повторно надсилає лист для підтвердження email.  
**Тіло запиту**: не потрібне.  
**Відповідь**: 301 Redirect

---

#### 4. Оновлення профілю поточного користувача

**Метод**: PATCH  
**URL**: `/api/profile`  
**Опис**: Оновлює профіль поточного залогіненого користувача.

**Тіло запиту**:

<pre><code>{
  "fullName": "нове ім'я користувача",
  "email": "новий email користувача (необов'язково)",
  "role": "нова роль користувача (необов'язково)",
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
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
</code></pre>

---

#### 5. Зміна пароля поточного користувача

**Метод**: PATCH  
**URL**: `/api/profile/password`  
**Опис**: Оновлює пароль поточного користувача.

**Тіло запиту**:

<pre><code>{
  "newPassword": "новий пароль",
  "confirmNewPassword": "підтвердження нового пароля"
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
  "permissions": ["НАЗВА_ДОЗВОЛУ", "НАЗВА_ДОЗВОЛУ", ...]
}
</code></pre>

---

#### 6. Зміна фото користувача

**Метод**: PATCH  
**URL**: `/api/profile/photo`  
**Опис**: Оновлює аватар користувача.  
**Формат запиту**: FormData

**Тіло запиту**:

<pre><code>{
  "photo": (файл зображення)
}
</code></pre>

**Відповідь**:

<pre><code>{
  "uuid": "uuid користувача",
  "photo": "фото користувача"
}
</code></pre>

---

#### 7. Видалення фото користувача

**Метод**: DELETE  
**URL**: `/api/profile/photo`  
**Опис**: Видаляє аватар користувача, повертаючи його до дефолтного.  
**Тіло запиту**: не потрібне.

**Відповідь**:

<pre><code>{
  "uuid": "uuid користувача",
  "photo": ""
}
</code></pre>

---

#### 8. Видалення облікового запису користувача

**Метод**: DELETE  
**URL**: `/api/profile`  
**Опис**: Видаляє обліковий запис поточного користувача.  
**Тіло запиту**: не потрібне.  
**Відповідь**: 200 OK

</details>
