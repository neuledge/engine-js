import { toStoreIndexes } from './store-index';

describe('mappers/store-index', () => {
  describe('toStoreIndexes()', () => {
    it('should convert a single primary index', () => {
      expect(
        toStoreIndexes([
          {
            index_name: 'PRIMARY',
            non_unique: 0,
            column_name: 'field_name',
            seq_in_index: 1,
            collation: 'A',
          },
        ]),
      ).toEqual([
        {
          name: 'PRIMARY',
          unique: 'primary',
          fields: {
            field_name: { sort: 'asc' },
          },
        },
      ]);
    });
  });
});
