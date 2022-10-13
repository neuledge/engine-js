import fs from 'node:fs';

export const catchExceptions = () =>
  process.on('uncaughtException', (err) => errorHandler(err));

const errorHandler = (err: unknown, code = 1): never => {
  fs.writeSync(process.stderr.fd, String((err as Error)?.stack || err) + '\n');

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code);
};
