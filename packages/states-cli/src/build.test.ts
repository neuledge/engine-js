import fs from 'node:fs/promises';
import { jest } from '@jest/globals';
import { build } from './build.js';

describe('build', () => {
  describe('build()', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should build state files', async () => {
      const readFile = jest
        .spyOn(fs, 'readFile')
        .mockImplementation(async () => 'state Foo { @id id: Number = 1 }');
      const writeFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(async () => void 0);

      await build(['foo.states'], { basepath: '/' });

      expect(readFile).toBeCalledTimes(1);
      expect(readFile).toBeCalledWith('/foo.states', { encoding: 'utf8' });

      expect(writeFile).toBeCalledTimes(1);
      expect(writeFile).toBeCalledWith(
        '/states.ts',
        `export class Foo {
  static $key = 'Foo' as const;
  static $projection: {
    id?: boolean;
  };
  static $query: {
    id?: number;
  };
  static $uniqueQuery: {
    id: number;
  };

  id!: number;
}
`,
      );
    });
  });
});
