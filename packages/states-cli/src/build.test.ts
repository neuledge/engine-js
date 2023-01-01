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
        `import { $ } from '@neuledge/engine';

@$.State<'Foo', Foo>()
export class Foo {
  static $name = 'Foo' as const;
  static $id = ['+id'] as const;
  static $scalars = {
    id: { type: $.scalars.Number, index: 1 },
  };
  static $find: $.Where<{
    id?: $.WhereNumber<$.scalars.Number>;
  }>;
  static $unique: {
    id: $.scalars.Number;
  };

  id!: $.scalars.Number;
}
export type $Foo = $.Entity<typeof Foo>;
`,
      );
    });
  });
});
