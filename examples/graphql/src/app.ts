import { fastify as Fastify } from 'fastify';
import fs from 'node:fs/promises';
import mercurius from 'mercurius';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { resolvers } from './resolvers';
import { engine } from './engine';

/* eslint-disable no-console */

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const app = Fastify();

  const schemaFile = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../schema.graphql',
  );
  const schema = await fs.readFile(schemaFile, { encoding: 'utf8' });

  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
    errorFormatter: (error, ...args) => {
      console.error(error);
      return mercurius.defaultErrorFormatter(error, ...args);
    },
  });

  await engine.ready();
  const address = await app.listen({ port: 3000 });

  console.info(`Server listening on: ${address}/graphiql`);
})();
