import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { assignFieldNames } from './fields';

/* eslint-disable max-lines-per-function */

describe('metadata/names', () => {
  describe('assignFieldNames()', () => {
    it('should generate field names for single field', () => {
      const fields = [{ name: 'id', type: NumberScalar }];
      assignFieldNames(fields);

      expect(fields).toEqual([{ name: 'id', type: NumberScalar }]);
    });

    it('should generate field names for unique fields', () => {
      const fields = [
        { name: 'id', type: NumberScalar },
        { name: 'name', type: StringScalar },
        { name: 'description', type: StringScalar },
      ];
      assignFieldNames(fields);

      expect(fields).toEqual([
        { name: 'id', type: NumberScalar },
        { name: 'name', type: StringScalar },
        { name: 'description', type: StringScalar },
      ]);
    });

    it('should generate field names for duplicate fields', () => {
      const fields = [
        { name: 'id', type: NumberScalar },
        { name: 'category_id', type: NumberScalar },
        { name: 'category_id', type: StringScalar },
      ];
      assignFieldNames(fields);

      expect(fields).toEqual([
        { name: 'id', type: NumberScalar },
        { name: 'category_id_number', type: NumberScalar },
        { name: 'category_id_string', type: StringScalar },
      ]);
    });

    it('should generate field names for duplicate equal fields', () => {
      const fields = [
        { name: 'id', type: NumberScalar },
        { name: 'id', type: NumberScalar },
        { name: 'id', type: NumberScalar },
      ];
      assignFieldNames(fields);

      expect(fields).toEqual([
        { name: 'id_1', type: NumberScalar },
        { name: 'id_2', type: NumberScalar },
        { name: 'id_3', type: NumberScalar },
      ]);
    });
  });
});
