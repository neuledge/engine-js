import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import fg from 'fast-glob';
import { States } from '@neuledge/states';
import { generate } from '@neuledge/states-ts';

export interface BuildOptions {
  basepath?: string;
  output?: string;
}

export const build = async (
  files: string[],
  options: BuildOptions,
): Promise<void> => {
  const states = new States(
    (filename) => fs.readFile(filename, { encoding: 'utf8' }),
    options.basepath,
  );

  const resolvedFiles = await fg(files, { cwd: options.basepath });
  await Promise.all(resolvedFiles.map((file) => states.import(file)));

  const outputFile = resolve(
    options.basepath ?? '',
    options.output || 'states.ts',
  );

  await fs.writeFile(outputFile, generate(states));
};
