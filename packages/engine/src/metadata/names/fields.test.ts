import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { renameDuplicateFieldNames } from './fields';

/* eslint-disable max-lines-per-function */

describe('metadata/names', () => {
  describe('renameDuplicateFieldNames()', () => {
    it('should keep the same field names for single state', () => {
      const state = {
        fields: [
          { name: 'id', type: NumberScalar },
          { name: 'name', type: StringScalar },
          { name: 'description', type: StringScalar },
        ],
      };
      renameDuplicateFieldNames([state]);

      expect(state.fields).toEqual([
        { name: 'id', type: NumberScalar },
        { name: 'name', type: StringScalar },
        { name: 'description', type: StringScalar },
      ]);
    });

    it('should keep the same field names for same types', () => {
      const states = [
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'name', type: StringScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'name', type: StringScalar },
            { name: 'description', type: StringScalar },
          ],
        },
      ];
      renameDuplicateFieldNames(states);

      expect(states).toEqual([
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'name', type: StringScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'name', type: StringScalar },
            { name: 'description', type: StringScalar },
          ],
        },
      ]);
    });

    it('should rename field names for duplicate fields', () => {
      const states = [
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: StringScalar },
          ],
        },
      ];
      renameDuplicateFieldNames(states);

      expect(states).toEqual([
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id_string', type: StringScalar },
          ],
        },
      ]);
    });

    it('should rename field names with type in the name for duplicate fields', () => {
      const states = [
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_number', type: StringScalar },
          ],
        },
      ];
      renameDuplicateFieldNames(states);

      expect(states).toEqual([
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_number_2', type: StringScalar },
          ],
        },
      ]);
    });

    it('should rename field names for duplicate fields when single name is taken', () => {
      const states = [
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: NumberScalar },
            { name: 'category_id_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: StringScalar },
          ],
        },
      ];
      renameDuplicateFieldNames(states);

      expect(states).toEqual([
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: NumberScalar },
            { name: 'category_id_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id_string', type: StringScalar },
          ],
        },
      ]);
    });

    it('should rename field names for duplicate fields when two names are taken', () => {
      const states = [
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: NumberScalar },
            { name: 'category_id_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: StringScalar },
            { name: 'category_id_string', type: StringScalar },
          ],
        },
      ];
      renameDuplicateFieldNames(states);

      expect(states).toEqual([
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id', type: NumberScalar },
            { name: 'category_id_number', type: NumberScalar },
          ],
        },
        {
          fields: [
            { name: 'id', type: NumberScalar },
            { name: 'category_id_2', type: StringScalar },
            { name: 'category_id_string', type: StringScalar },
          ],
        },
      ]);
    });
  });
});
