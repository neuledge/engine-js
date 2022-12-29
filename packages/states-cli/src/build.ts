import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import fg from 'fast-glob';
import { StatesContext } from '@neuledge/states';
import { generate } from '@neuledge/typescript-states';
import pLimit from 'p-limit';

export interface BuildOptions {
  basepath?: string;
  output?: string;
}

export const build = async (
  files: string[],
  options: BuildOptions,
): Promise<void> => {
  const asyncLimit = pLimit(10);
  const resolvedFiles = await resolveFiles(files, options.basepath);

  const inputs = await Promise.all(
    resolvedFiles.map((filepath) =>
      asyncLimit(async () => ({
        source: await fs.readFile(filepath, { encoding: 'utf8' }),
        filepath,
      })),
    ),
  );

  const ctx = new StatesContext();
  await ctx.load(inputs);

  const outputFile = resolve(
    options.basepath ?? '',
    options.output || 'states.ts',
  );

  await fs.writeFile(outputFile, generate(ctx));
};

const resolveFiles = async (
  files: string[],
  basepath?: string,
): Promise<string[]> => {
  const resolvedFiles = [];
  const dynamicFiles = [];

  for (const file of files) {
    if (fg.isDynamicPattern(file)) {
      dynamicFiles.push(file);
    } else {
      resolvedFiles.push(resolve(basepath ?? '', file));
    }
  }

  return [
    ...resolvedFiles,
    ...(await fg(dynamicFiles, {
      cwd: basepath,
      onlyFiles: true,
      unique: true,
    })),
  ];
};
