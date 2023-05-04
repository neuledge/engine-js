import { toStoreIndex } from './store-index';

describe('mappers/store-index', () => {
  describe('toStoreIndex()', () => {
    it('should convert a single primary index', () => {
      expect(
        toStoreIndex([
          {
            index_name: 'id_index',
            column_name: 'field_name',
            seq_in_index: 1,
            direction: 'ASC',
            is_unique: true,
            is_primary: true,
            is_auto_increment: true,
          },
        ]),
      ).toEqual({
        name: 'id_index',
        unique: 'primary',
        auto: 'increment',
        fields: {
          field_name: { sort: 'asc' },
        },
      });
    });
  });
});
