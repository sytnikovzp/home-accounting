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
ACCESS_TOKEN_TIME=15m
REFRESH_TOKEN_TIME=60d

SALT_ROUNDS=9
STATIC_PATH=public
CLIENT_URL=http://localhost:3000

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=projectpet7@gmail.com
SMTP_PASSWORD="kzlp javu fwoq kszk"

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
