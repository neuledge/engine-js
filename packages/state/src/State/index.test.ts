import { Scalar } from '@neuledge/scalar';
import { createState, State } from './index.js';

/* eslint-disable max-lines-per-function */

describe('State', () => {
  describe('State<>', () => {
    type UserState = State<
      'UserState',
      {
        id: {
          index: 1;
          type: Scalar<string, Buffer | string>;
          primaryKey: true;
        };
        email: {
          index: 2;
          type: Scalar<string>;
        };
        passwordHash: {
          index: 3;
          type: Scalar<Buffer, { id: string; email: string; password: string }>;
          nullable: true;
        };
      }
    >;

    it('should hold the exact key', () => {
      expect<'UserState'>('UserState' as UserState['key']);
    });

    it('should hold field exact properties', () => {
      expect<3>(3 as UserState['schema']['passwordHash']['index']);
      expect<true>(true as UserState['schema']['id']['primaryKey']);
      expect<true>(true as UserState['schema']['passwordHash']['nullable']);
      expect<Scalar<string>>({
        encode: String,
      } as UserState['schema']['email']['type']);
    });
  });

  describe('createState()', () => {
    it('should preserve state key', () => {
      const state = createState({
        key: 'TestState',
        schema: {},
      });

      expect<'TestState'>(state.key);
    });

    it('should preserve state fields scalar type', () => {
      const state = createState({
        key: 'TestState',
        schema: {
          name: { index: 1, type: { encode: String } },
        },
      });

      expect<Scalar<string, unknown>>(state.schema.name.type);
    });

    it('should preserve state fields scalar[] type', () => {
      const state = createState({
        key: 'TestState',
        schema: {
          name: { index: 1, type: [{ encode: String }] },
        },
      });

      expect<Scalar<string, unknown>[]>(state.schema.name.type);
    });

    it('should use inself', async () => {
      type TestState = State<
        'TestState',
        { self: { index: 1; type: [TestState] } }
      >;

      const state: TestState = createState(() => ({
        key: 'TestState',
        schema: {
          self: { index: 1, type: [state] },
        },
      }));

      expect<TestState>(state).toEqual({});
      await Promise.resolve().then(() => null);

      expect<[TestState]>(state.schema.self.type).toEqual([state]);
    });

    it('should preserve state fields primary key', () => {
      const state = createState({
        key: 'TestState',
        schema: {
          id: { index: 1, type: { encode: String }, primaryKey: true },
          name: { index: 2, type: { encode: String }, primaryKey: false },
        },
      });

      expect<true>(state.schema.id.primaryKey);
      expect<false>(state.schema.name.primaryKey);
    });

    it('should preserve state fields nullable', () => {
      const state = createState({
        key: 'TestState',
        schema: {
          name: { index: 2, type: { encode: String }, nullable: true },
          email: { index: 3, type: { encode: String }, nullable: false },
        },
      });

      expect<true>(state.schema.name.nullable);
      expect<false>(state.schema.email.nullable);
    });
  });
});
