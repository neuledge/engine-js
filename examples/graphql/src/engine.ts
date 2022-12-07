import { NeuledgeEngine } from '@neuledge/engine';
import { MongoDBStore } from '@neuledge/mongodb-store';

export const store = new MongoDBStore({
  url: 'mongodb://localhost:27017',
  name: 'graphql-example',
});

export const engine = new NeuledgeEngine({
  store,
});
