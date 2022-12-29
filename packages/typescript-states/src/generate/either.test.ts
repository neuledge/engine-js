import { Either, StatesContext } from '@neuledge/states';
import { generateEither } from './either';

/* eslint-disable max-lines-per-function */

describe('generate/either', () => {
  describe('generateEither()', () => {
    it('should generate state', async () => {
      const ctx = new StatesContext();
      await ctx.exec(`
        state CreatedUser { 
            @id id: Number = 1
            name: String = 2
            email?: String = 3
        }

        state SignedUser { 
            @id id: Number = 1
            name?: String = 2
            email: String = 3
        }
        
        either User = CreatedUser | SignedUser`);

      expect(generateEither(ctx.entity('User') as Either))
        .toMatchInlineSnapshot(`
          "export type User = CreatedUser | SignedUser;
          export const User: $.Either<'User', typeof CreatedUser | typeof SignedUser> =
            $.either('User', [CreatedUser, SignedUser]);
          export type $User = $.Entity<typeof User[number]>;"
        `);
    });
  });
});
