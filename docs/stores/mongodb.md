# MongoDB Store

The MongoDB store is a [store](../get-started/store.md) that uses [MongoDB](https://www.mongodb.com/) as the underlying database.

> MongoDB is a document-oriented database. It is a NoSQL database, which means that it does not use SQL to query the database. Instead, it uses JSON-like queries. MongoDB is a very popular database, and it is used by many companies, including Netflix, eBay, and Cisco.

## Installation

Assuming you already have a MongoDB server running, you can install the MongoDB client library using:

```bash
npm install @neuledge/mongodb-store
```

### Creating the store instanse

In order to use the MongoDB store, you need to create a store instance. The store instance is a class that is used to interact with the database. The store instance is created by passing the database connection string and the database name to the constructor:

```ts filename="src/store.ts"
import { MongoDBStore } from '@neuledge/mongodb-store';

export const store = new MongoDBStore({
  url: process.env.MONGODB_URL ?? 'mongodb://localhost:27017',
  name: process.env.MONGODB_DATABASE ?? 'test-database',
});
```

That's it! You have created a store instance. Neuledge will use it to connect and store your data on the database.

---

When you are done with the store, you should close it. This will close the
connection to the database. You can do this by calling the `close()`
method and await for it to finish.

```ts
await store.close();
```
