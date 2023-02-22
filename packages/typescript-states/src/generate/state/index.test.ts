import { State, StatesContext } from '@neuledge/states';
import { generateState } from './index';

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
          static $id = { fields: ['+id'] } as const;
          static $scalars = () => ({
            id: { type: $.scalars.Number, index: 1 },
            name: { type: $.scalars.String, index: 2 },
            email: { type: $.scalars.String, index: 3, nullable: true },
          });
          static $where: {
            id?: $.WhereNumber<$.scalars.Number> | null;
          };
          static $unique: {
            id: $.scalars.Number;
          };
          static $filter: {
            id?: $.WhereNumber<$.scalars.Number> | null;
            name?: $.WhereString<$.scalars.String> | null;
            email?: $.WhereNullableString<$.scalars.String> | null;
          };

          id!: $.scalars.Number;
          name!: $.scalars.String;
          email?: $.scalars.String | null;
        }
        export type $User = $.Entity<typeof User>;"
      `);
    });
  });
});
