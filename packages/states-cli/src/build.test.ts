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
import {
  BooleanScalar as Boolean,
  BufferScalar as Buffer,
  NumberScalar as Number,
  StringScalar as String,
  ObjectScalar as Object,
  DateTimeScalar as DateTime,
} from '@neuledge/scalars';

@$.State<'Foo', Foo>()
export class Foo {
  static $name = 'Foo' as const;
  static $id = ['+id'] as const;
  static $scalars = {
    id: { type: Number, index: 1 },
  };
  static $find: $.Where<{
    id?: $.WhereNumber<Number>;
  }>;
  static $unique: {
    id: Number;
  };

  id!: Number;
}
export type $Foo = $.Entity<typeof Foo>;
`,
      );
    });
  });
});
