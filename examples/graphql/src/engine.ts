import * as dotenv from 'dotenv';
import { NeuledgeEngine } from '@neuledge/engine';
import { MongoDBStore } from '@neuledge/mongodb-store';

dotenv.config();

export const store = new MongoDBStore({
  url: process.env.MONGODB_URL ?? 'mongodb://localhost:27017',
  name: process.env.MONGODB_DATABASE ?? 'graphql-example',
});

export const engine = new NeuledgeEngine({
  store,
});
