import { MetadataSchema, MetadataStateField } from '@/metadata/index.js';
import { NumberScalar } from '@neuledge/scalars';
import { convertWhereRecord } from './record.js';

/* eslint-disable max-lines-per-function */

describe('engine/filter/where/record', () => {
  describe('convertWhereRecord()', () => {
    const oldFoo: MetadataStateField = {
      name: 'foo_old',
      path: 'foo',
      type: NumberScalar,
      nullable: false,
      indexes: [1],
    };
    const foo: MetadataStateField = {
      name: 'foo',
      path: 'foo',
      type: NumberScalar,
      nullable: false,
      indexes: [1],
    };
    const bar: MetadataStateField = {
      name: 'bar',
      path: 'bar',
      type: NumberScalar,
      nullable: false,
      indexes: [2],
    };
    const entityId: MetadataStateField = {
      name: 'entity_id',
      path: 'entity.id',
      type: NumberScalar,
      nullable: false,
      indexes: [3, 1],
    };
    const entitySubId: MetadataStateField = {
      name: 'entity_subId',
      path: 'entity.subId',
      type: NumberScalar,
      nullable: false,
      indexes: [3, 2],
    };
    const basicMap: MetadataSchema = {
      foo: [{ field: foo }],
      bar: [{ field: bar }],
      entity: [
        {
          schema: {
            id: [{ field: entityId }],
            subId: [{ field: entitySubId }],
          },
        },
      ],
      'entity.id': [{ field: entityId }],
      'entity.subId': [{ field: entitySubId }],
    };
    const renamedMap: MetadataSchema = {
      foo: [{ field: foo }, { field: oldFoo }],
    };

    it('should throw an error if the operator is unknown', () => {
      expect(() =>
        convertWhereRecord(basicMap, { foo: { $unknown: 1 } }),
      ).toThrow('Invalid operator: $unknown');
    });

    it('should throw an error if the path is unknown', () => {
      expect(() => convertWhereRecord(basicMap, { zoo: { $eq: 1 } })).toThrow(
        "Unknown where key: 'zoo'",
      );
    });

    it('should handle single value $eq', () => {
      expect(convertWhereRecord(basicMap, { foo: { $eq: 123 } })).toEqual([
        { foo: { $eq: 123 } },
      ]);
    });

    it('should handle single null $eq', () => {
      expect(convertWhereRecord(basicMap, { foo: { $eq: null } })).toEqual([
        { foo: { $eq: null } },
      ]);
    });

    it('should handle single value $gt', () => {
      expect(convertWhereRecord(basicMap, { foo: { $gt: 123 } })).toEqual([
        { foo: { $gt: 123 } },
      ]);
    });

    it('should handle single value $gt and $lt', () => {
      expect(
        convertWhereRecord(basicMap, { foo: { $gt: 123, $lt: 456 } }),
      ).toEqual([{ foo: { $gt: 123, $lt: 456 } }]);
    });

    it('should handle renamed single value $eq', () => {
      expect(convertWhereRecord(renamedMap, { foo: { $eq: 123 } })).toEqual([
        { foo: { $eq: 123 } },
        { foo_old: { $eq: 123 } },
      ]);
    });

    it('should handle renamed single value $lt and $gt', () => {
      expect(
        convertWhereRecord(renamedMap, { foo: { $gt: 123, $lt: 456 } }),
      ).toEqual([
        { foo: { $gt: 123, $lt: 456 } },
        { foo_old: { $gt: 123, $lt: 456 } },
      ]);
    });

    it('should handle multi field $eq', () => {
      expect(
        convertWhereRecord(basicMap, {
          foo: { $eq: 123 },
          bar: { $eq: 456 },
        }),
      ).toEqual([{ foo: { $eq: 123 }, bar: { $eq: 456 } }]);
    });

    it('should handle single path value $eq', () => {
      expect(
        convertWhereRecord(basicMap, { 'entity.id': { $eq: 123 } }),
      ).toEqual([{ entity_id: { $eq: 123 } }]);
    });

    it('should handle multi value $eq', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: { $eq: { id: 123, subId: 456 } },
        }),
      ).toEqual([{ entity_id: { $eq: 123 }, entity_subId: { $eq: 456 } }]);
    });

    it('should handle single value $ne', () => {
      expect(convertWhereRecord(basicMap, { foo: { $ne: 123 } })).toEqual([
        { foo: { $ne: 123 } },
      ]);
    });

    it('should handle multi field $ne', () => {
      expect(
        convertWhereRecord(basicMap, { foo: { $ne: 123 }, bar: { $ne: 456 } }),
      ).toEqual([{ foo: { $ne: 123 }, bar: { $ne: 456 } }]);
    });

    it('should handle multi value $ne', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: { $ne: { id: 123, subId: 456 } },
        }),
      ).toEqual([
        { entity_id: { $ne: 123 } },
        { entity_id: { $eq: 123 }, entity_subId: { $ne: 456 } },
      ]);
    });

    it('should handle single value $in', () => {
      expect(convertWhereRecord(basicMap, { foo: { $in: [123] } })).toEqual([
        { foo: { $in: [123] } },
      ]);
    });

    it('should handle multi value $in', () => {
      expect(
        convertWhereRecord(basicMap, { foo: { $in: [123, 456] } }),
      ).toEqual([{ foo: { $in: [123, 456] } }]);
    });

    it('should handle single object value $in', () => {
      expect(
        convertWhereRecord(basicMap, { entity: { $in: [{ id: 123 }] } }),
      ).toEqual([{ entity_id: { $eq: 123 } }]);
    });

    it('should handle single object multi value $in', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: { $in: [{ id: 123, subId: 456 }] },
        }),
      ).toEqual([{ entity_id: { $eq: 123 }, entity_subId: { $eq: 456 } }]);
    });

    it('should handle multi object multi value $in', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: {
            $in: [
              { id: 123, subId: 456 },
              { id: 987, subId: 654 },
            ],
          },
        }),
      ).toEqual([
        { entity_id: { $eq: 123 }, entity_subId: { $eq: 456 } },
        { entity_id: { $eq: 987 }, entity_subId: { $eq: 654 } },
      ]);
    });

    it('should handle single value $nin', () => {
      expect(convertWhereRecord(basicMap, { foo: { $nin: [123] } })).toEqual([
        { foo: { $nin: [123] } },
      ]);
    });

    it('should handle multi value $nin', () => {
      expect(
        convertWhereRecord(basicMap, { foo: { $nin: [123, 456] } }),
      ).toEqual([{ foo: { $nin: [123, 456] } }]);
    });

    it('should handle single object value $nin', () => {
      expect(
        convertWhereRecord(basicMap, { entity: { $nin: [{ id: 123 }] } }),
      ).toEqual([{ entity_id: { $ne: 123 } }]);
    });

    it('should handle multi object value $nin', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: { $nin: [{ id: 123 }, { id: 456 }] },
        }),
      ).toEqual([{ entity_id: { $nin: [123, 456] } }]);
    });

    it('should handle single object multi value $nin', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: { $nin: [{ id: 123, subId: 456 }] },
        }),
      ).toEqual([
        { entity_id: { $ne: 123 } },
        { entity_id: { $eq: 123 }, entity_subId: { $ne: 456 } },
      ]);
    });

    it('should handle multi object multi value $nin', () => {
      expect(
        convertWhereRecord(basicMap, {
          entity: {
            $nin: [
              { id: 123, subId: 456 },
              { id: 987, subId: 654 },
            ],
          },
        }),
      ).toEqual([
        { entity_id: { $nin: [123, 987] } },
        { entity_id: { $eq: 123 }, entity_subId: { $ne: 456 } },
        { entity_id: { $eq: 987 }, entity_subId: { $ne: 654 } },
      ]);
    });
  });
});
