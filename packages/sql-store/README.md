# Neuledge MySQL Store

An store for [Neuledge Engine](https://neuledge.com) that uses [SQL](https://en.wikipedia.org/wiki/SQL) connection as a backend.

This library is not intended to be used directly. It is a dependency of the SQL-based stores such as **MySQL** and **PostgreSQL**. For more information, please refer to the [main repository](https://github.com/neuledge/engine-js)

## 📦 Installation

```bash
npm install @neuledge/sql-store
```

## 🚀 Getting started

```ts
import { SQLStore } from '@neuledge/mysql-store';

// create a connection to your SQL database somehow
const connection = createPool({
  // ...
});

const store = new SQLStore(connection);

const engine = new Engine({
  store,
});
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
