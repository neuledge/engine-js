import { Scalar } from '@neuledge/scalar';
import { State } from '@neuledge/state';
import { EntityId } from './Id.js';

describe('Id', () => {
  describe('EntityId<>', () => {
    it('should match the entity id with single field', () => {
      type TestType = EntityId<
        State<
          'Test',
          {
            id: { index: 1; type: Scalar<number>; primaryKey: true };
            name: { index: 2; type: Scalar<string> };
          }
        >
      >;

      expect<{ id: number }>({ id: 123 } as TestType);
    });

    it('should match the entity id with multiple fields', () => {
      type TestType = EntityId<
        State<
          'Test',
          {
            id: { index: 1; type: Scalar<number>; primaryKey: true };
            subId: { index: 1; type: Scalar<string>; primaryKey: true };
            name: { index: 2; type: Scalar<string> };
          }
        >
      >;

      expect<{ id: number; subId: string }>({
        id: 123,
        subId: 'foo',
      } as TestType);
    });
  });
});
