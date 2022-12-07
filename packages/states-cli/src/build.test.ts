import fs from 'node:fs/promises';
import { jest } from '@jest/globals';
import { build } from './build';

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

      expect(readFile).toHaveBeenCalledTimes(1);
      expect(readFile).toHaveBeenCalledWith('/foo.states', {
        encoding: 'utf8',
      });

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledWith(
        '/states.ts',
        `export class Foo {
  static $key = 'Foo' as const;
  static $projection: {
    id?: boolean;
  };
  static $find: {
    id?: number;
  };
  static $unique: {
    id: number;
  };

  id!: number;
}
`,
      );
    });
  });
});
