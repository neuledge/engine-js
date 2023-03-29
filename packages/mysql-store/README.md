# Neuledge MySQL Store

A store for [Neuledge Engine](https://neuledge.com) that uses [MySQL](https://www.mysql.com) database as a backend.

## 📦 Installation

```bash
npm install @neuledge/mysql-store
```

## 🚀 Getting started

```ts
import { MySQLStore } from '@neuledge/mysql-store';

const store = new MySQLStore({
  uri: process.env.MYSQL_URI ?? 'mysql://localhost:3306',
  database: process.env.MYSQL_DATABASE ?? 'my-database',
});

const engine = new Engine({
  store,
});
```

For more information, please refer to the [main repository](https://github.com/neuledge/engine-js).

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
