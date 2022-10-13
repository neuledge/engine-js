import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { build } from './build.js';
import { catchExceptions } from './error.js';

const { version }: { version: string } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url)).toString(),
);

export const createProgram = () => {
  const program = new Command();

  setProgram(program);
  setBuildCommand(program);

  catchExceptions();

  return program;
};

const setProgram = (program: Command) =>
  program
    .name('states')
    .description('CLI to build and compile `.states` files')
    .version(version, '-v, --version', 'output the current version');

const setBuildCommand = (program: Command) =>
  program
    .command('build')
    .description('Convert `.states` files to TypeScript files')
    .argument('<files...>', 'files to build')
    .option('-P, --basepath <path>', 'base path')
    .option('-O, --output <file>', 'output ts file')
    .action((files: string[], options) => build(files, options));
