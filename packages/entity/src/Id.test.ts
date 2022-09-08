import { EntityId } from './Id.js';

describe('Id', () => {
  describe('EntityId<>', () => {
    it('should match the entity id with single field', () => {
      class State {
        static $$PrimaryKeys = ['id'] as const;

        id!: string;
        name!: string;
      }

      expect<EntityId<typeof State>>({ id: 'foo' });
    });
  });
});
