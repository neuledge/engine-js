import { FieldNode, StateNode, States } from '@neuledge/states';
import { generateState } from './state';

/* eslint-disable max-lines-per-function */

describe('generate/state', () => {
  describe('generateState()', () => {
    it('should generate state', async () => {
      const states = new States();
      await states.exec(`
        state User { 
            @id id: Number = 1
            name: String = 2
            email?: String = 3
        }`);

      expect(
        generateState(
          states.entity('User') as StateNode,
          states.fields('User') as FieldNode[],
        ),
      ).toMatchInlineSnapshot(`
        "@$.State
        export class User {
          static $name = 'User' as const;
          static $projection: {
            id?: boolean;
            name?: boolean;
            email?: boolean;
          };
          static $find: {
            id?: number;
          };
          static $unique: {
            id: number;
          };

          id!: number;
          name!: string;
          email?: string | null;
        }"
      `);
    });
  });
});
