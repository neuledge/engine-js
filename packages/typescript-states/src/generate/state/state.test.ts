import { State, StatesContext } from '@neuledge/states';
import { generateState } from './state';

/* eslint-disable max-lines-per-function */

describe('generate/state', () => {
  describe('generateState()', () => {
    it('should generate state', async () => {
      const ctx = new StatesContext();
      await ctx.exec(`
        state User { 
            @id id: Number = 1
            name: String = 2
            email?: String = 3
        }`);

      expect(generateState(ctx.entity('User') as State)).toMatchInlineSnapshot(`
        "@$.State<'User', User>()
        export class User {
          static $name = 'User' as const;
          static $id = ['+id'] as const;
          static $scalars = {
            id: { type: Number, index: 1 },
            name: { type: String, index: 2 },
            email: { type: String, index: 3, nullable: true },
          };
          static $find: $.Where<{
            id?: $.WhereNumber<Number>;
          }>;
          static $unique: {
            id: Number;
          };

          id!: Number;
          name!: String;
          email?: String | null;
        }
        export type $User = $.Entity<typeof User>;"
      `);
    });
  });
});
