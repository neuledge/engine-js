import { fastify as Fastify } from 'fastify';
import fs from 'node:fs';
import mercurius from 'mercurius';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { resolvers } from './resolvers';

const app = Fastify();

const schemaFile = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  '../schema.graphql',
);
const schema = fs.readFileSync(schemaFile, { encoding: 'utf8' });

app.register(mercurius, {
  schema,
  resolvers,
});

app.listen({ port: 3000 });
