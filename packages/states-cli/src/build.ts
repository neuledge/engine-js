import fs from 'node:fs/promises';
import { States } from '@neuledge/states';
import { generate } from '@neuledge/states-typescript';

export const build = async (
  files: string[],
  basepath?: string,
): Promise<void> => {
  const states = new States(
    (filename) => fs.readFile(filename, { encoding: 'utf8' }),
    basepath,
  );

  for (const file of files) {
    const def = await states.import(file);

    const tsFile = `${file}.ts`;
    await fs.writeFile(tsFile, generate(states, def));
  }
};
