import { NeuledgeEngine } from './engine.js';
import { EngineStore } from './store.js';
import { StateEntity } from './types/state.js';

describe('Engine', () => {
  describe('NeuledgeEngine', () => {
    it('should constract', async () => {
      const engine = new NeuledgeEngine({} as EngineStore);

      expect(engine);

      class state {
        static $key = 'Test' as const;
        static $projection: {
          id?: boolean;
          firstName?: boolean;
          lastName?: boolean;
        };
        static $query: { id?: number };
        static $uniqueQuery: { id: number };

        id!: number;
        firstName!: string;
        lastName?: string;

        static update(
          self: state,
          args: { foo: string },
        ): StateEntity<typeof state> {
          throw -1;
        }
      }

      const res = await engine.mutateUnique({
        states: [state],
        where: { id: 123 },
        action: 'update',
        arguments: { foo: 'str' },
        select: { firstName: true, lastName: true },
      });

      res?.$state;
      res?.firstName;
      res?.firstName;
    });
  });
});
