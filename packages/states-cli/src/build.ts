import fs from 'node:fs/promises';
import { StatesContext } from '@neuledge/states';
import { generate } from '@neuledge/states-typescript';

export const build = async (
  files: string[],
  basepath?: string,
): Promise<void> => {
  const ctx = new StatesContext(basepath);

  for (const file of files) {
    const def = await ctx.import(file);

    const tsFile = `${file}.ts`;
    await fs.writeFile(tsFile, generate(def));
  }
};
