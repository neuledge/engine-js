export const errorHandler = (err: unknown, code = 1): never => {
  // eslint-disable-next-line no-console
  console.error((err as Error)?.stack || err);

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code);
};
