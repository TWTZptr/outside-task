## При необходимости развернуть быстро и просто

Создаем файл .env и полностью копируем содержимое .env.example.

После чего:

```
docker compose up
```

## При ручном развертывании без Docker

Создать .env со своими данными по образцу .env.example.

```
yarn
```

или

```
npm i
```

После чего

```
yarn start:dev
```

или

```
npm run start:dev
```

Описание .env параметов:

APP_HOST=имя-хоста

APP_PORT=порт

POSTGRES_USER=имя-пользователя-БД

POSTGRES_PASSWORD=пароль-пользователя-БД

POSTGRES_DB=имя-БД

POSTGRES_HOST=имя-хоста-БД

POSTGRES_PORT=порт-БД

ACCESS_TOKEN_EXPIRATION_TIME=время-действия-токена-доступа

ACCESS_TOKEN_SECRET=секрет-токена-доступа

REFRESH_TOKEN_EXPIRATION_TIME=время-действия-токена-обновления

REFRESH_TOKEN_SECRET=секрет-токена-обновления
