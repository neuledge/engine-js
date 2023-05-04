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
  host: process.env.POSTGRESQL_HOST ?? 'localhost',
  port: Number(process.env.POSTGRESQL_PORT) ?? 5432,
  user: process.env.POSTGRESQL_USER ?? 'postgres',
  password: process.env.POSTGRESQL_PASSWORD,
  ssl: process.env.POSTGRESQL_SSL === 'true',
  database: process.env.POSTGRESQL_DATABASE ?? 'my-database',
});

const engine = new Engine({
  store,
});
```

For more information, please refer to the [main repository](https://github.com/neuledge/engine-js).

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
