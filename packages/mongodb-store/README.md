# Neuledge MongoDB Store

A store for [Neuledge Engine](https://neuledge.com) that uses [MongoDB](https://www.mongodb.com/) as the database backend.

## 📦 Installation

```bash
npm install @neuledge/mongodb-store
```

## 🚀 Getting started

```ts
import { Engine } from '@neuledge/engine';
import { MongoDBStore } from '@neuledge/mongodb-store';

const store = new MongoDBStore({
  url: process.env.MONGODB_URL ?? 'mongodb://localhost:27017',
  name: process.env.MONGODB_DATABASE ?? 'my-database',
});

const engine = new Engine({
  store,
});
```

For more information, please refer to the [main repository](https://github.com/neuledge/engine-js).

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
