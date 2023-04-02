# Neuledge PostgreSQL Store

A store for [Neuledge Engine](https://neuledge.com) that uses [PostgreSQL](https://www.postgresql.org) database as a backend.

## 📦 Installation

```bash
npm install @neuledge/postgresql-store
```

## 🚀 Getting started

```ts
import { PostgreSQLStore } from '@neuledge/postgresql-store';

const store = new PostgreSQLStore({
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
