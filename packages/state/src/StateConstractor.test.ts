import { StateConstractor } from './StateConstractor.js';

describe('StateConstractor', () => {
  describe('StateConstractor<>', () => {
    it('should have valid primary keys', () => {
      class State {
        static readonly $$PrimaryKeys = ['key', 'value'] as const;

        key!: string;
        value!: string;
      }

      expect<StateConstractor<State>>(State);
      expect<readonly ['key', 'value']>(State.$$PrimaryKeys);
    });
  });
});
