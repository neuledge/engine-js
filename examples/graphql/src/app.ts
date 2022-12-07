import { fastify as Fastify } from 'fastify';
import fs from 'node:fs';
import mercurius from 'mercurius';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { resolvers } from './resolvers';

/* eslint-disable no-console */

const app = Fastify();

const schemaFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../schema.graphql',
);
const schema = fs.readFileSync(schemaFile, { encoding: 'utf8' });

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  errorFormatter: (error, ...args) => {
    console.error(error);
    return mercurius.defaultErrorFormatter(error, ...args);
  },
});

app.listen({ port: 3000 });

console.info('Server listening on: http://localhost:3000/graphiql');
