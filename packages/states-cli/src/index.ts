import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { setGenerateCommand } from './generate';
import { catchExceptions } from './error';

const { version }: { version: string } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url)).toString(),
);

export const createProgram = () => {
  const program = new Command();

  setProgram(program);
  setGenerateCommand(program);

  catchExceptions();

  return program;
};

const setProgram = (program: Command) =>
  program
    .name('states')
    .description('CLI to build and compile `.states` files')
    .version(version, '-v, --version', 'output the current version');
