// import {
//   MetadataCollectionFieldMap,
//   MetadataStateField,
// } from '@/metadata/index.js';
// import { NumberScalar } from '@neuledge/scalars';
// import { flattenWhere } from './flatten.js';
//
// /* eslint-disable max-lines-per-function */
//
// describe('engine/filter/where/flatten', () => {
//   describe('flattenWhere()', () => {
//     const oldFoo: MetadataStateField = {
//       name: 'foo_old',
//       path: 'foo',
//       type: NumberScalar,
//       nullable: false,
//       indexes: [1],
//     };
//     const foo: MetadataStateField = {
//       name: 'foo',
//       path: 'foo',
//       type: NumberScalar,
//       nullable: false,
//       indexes: [1],
//     };
//     const bar: MetadataStateField = {
//       name: 'bar',
//       path: 'bar',
//       type: NumberScalar,
//       nullable: false,
//       indexes: [2],
//     };
//     const entityId: MetadataStateField = {
//       name: 'entity_id',
//       path: 'entity.id',
//       type: NumberScalar,
//       nullable: false,
//       indexes: [3, 1],
//     };
//     const entitySubId: MetadataStateField = {
//       name: 'entity_subId',
//       path: 'entity.subId',
//       type: NumberScalar,
//       nullable: false,
//       indexes: [3, 2],
//     };
//     const basicMap: MetadataCollectionFieldMap = {
//       [foo.path]: { fields: new Map([[foo.name, foo]]), children: new Set() },
//       [bar.path]: { fields: new Map([[bar.name, bar]]), children: new Set() },
//       entity: {
//         fields: new Map(),
//         children: new Set([entityId.path, entitySubId.path]),
//       },
//       [entityId.path]: {
//         fields: new Map([[entityId.name, entityId]]),
//         children: new Set(),
//       },
//       [entitySubId.path]: {
//         fields: new Map([[entitySubId.name, entitySubId]]),
//         children: new Set(),
//       },
//     };
//     const renamedFooMap: MetadataCollectionFieldMap = {
//       [foo.path]: {
//         fields: new Map([
//           [foo.name, foo],
//           [oldFoo.name, oldFoo],
//         ]),
//         children: new Set(),
//       },
//     };
//
//     it('should throw an error if the operator is unknown', () => {
//       expect(() =>
//         flattenWhere(basicMap, { foo: { $unknown: 1 } }),
//       ).toThrowError("Unknown where operator: '$unknown'");
//     });
//
//     it('should throw an error if the path is unknown', () => {
//       expect(() => flattenWhere(basicMap, { zoo: { $eq: 1 } })).toThrowError(
//         "Unknown where path: 'zoo'",
//       );
//     });
//
//     it('should handle single value $eq', () => {
//       expect(flattenWhere(basicMap, { foo: { $eq: 123 } })).toEqual([
//         { foo: { $eq: 123 } },
//       ]);
//     });
//
//     it('should handle single null $eq', () => {
//       expect(flattenWhere(basicMap, { foo: { $eq: null } })).toEqual([
//         { foo: { $eq: null } },
//       ]);
//     });
//
//     it('should handle single value $gt', () => {
//       expect(flattenWhere(basicMap, { foo: { $gt: 123 } })).toEqual([
//         { foo: { $gt: 123 } },
//       ]);
//     });
//
//     it('should handle single value $gt and $lt', () => {
//       expect(flattenWhere(basicMap, { foo: { $gt: 123, $lt: 456 } })).toEqual([
//         { foo: { $gt: 123, $lt: 456 } },
//       ]);
//     });
//
//     it('should handle renamed single value $eq', () => {
//       expect(flattenWhere(renamedFooMap, { foo: { $eq: 123 } })).toEqual([
//         { foo: { $eq: 123 } },
//       ]);
//     });
//
//     it('should handle renamed single value $lt and $gt', () => {
//       expect(
//         flattenWhere(renamedFooMap, { foo: { $gt: 123, $lt: 456 } }),
//       ).toEqual([{ foo: { $gt: 123, $lt: 456 } }]);
//     });
//
//     it('should handle multi field $eq', () => {
//       expect(
//         flattenWhere(basicMap, { foo: { $eq: 123 }, bar: { $eq: 456 } }),
//       ).toEqual([{ foo: { $eq: 123 }, bar: { $eq: 456 } }]);
//     });
//
//     it('should handle single path value $eq', () => {
//       expect(
//         flattenWhere(basicMap, {
//           'entity.id': { $eq: 123 },
//         }),
//       ).toEqual([{ 'entity.id': { $eq: 123 } }]);
//     });
//
//     it('should handle multi value $eq', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $eq: { id: 123, subId: 456 } } }),
//       ).toEqual([{ 'entity.id': { $eq: 123 }, 'entity.subId': { $eq: 456 } }]);
//     });
//
//     it('should handle single value $ne', () => {
//       expect(flattenWhere(basicMap, { foo: { $ne: 123 } })).toEqual([
//         { foo: { $ne: 123 } },
//       ]);
//     });
//
//     it('should handle multi field $ne', () => {
//       expect(
//         flattenWhere(basicMap, { foo: { $ne: 123 }, bar: { $ne: 456 } }),
//       ).toEqual([{ foo: { $ne: 123 }, bar: { $ne: 456 } }]);
//     });
//
//     it('should handle multi value $ne', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $ne: { id: 123, subId: 456 } } }),
//       ).toEqual([
//         { 'entity.id': { $ne: 123 } },
//         { 'entity.subId': { $ne: 456 } },
//       ]);
//     });
//
//     it('should handle single value $in', () => {
//       expect(flattenWhere(basicMap, { foo: { $in: [123] } })).toEqual([
//         { foo: { $in: [123] } },
//       ]);
//     });
//
//     it('should handle multi value $in', () => {
//       expect(flattenWhere(basicMap, { foo: { $in: [123, 456] } })).toEqual([
//         { foo: { $in: [123, 456] } },
//       ]);
//     });
//
//     it('should handle single object value $in', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $in: [{ id: 123 }] } }),
//       ).toEqual([{ 'entity.id': { $eq: 123 } }]);
//     });
//
//     it('should handle single object multi value $in', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $in: [{ id: 123, subId: 456 }] } }),
//       ).toEqual([{ 'entity.id': { $eq: 123 }, 'entity.subId': { $eq: 456 } }]);
//     });
//
//     it('should handle multi object multi value $in', () => {
//       expect(
//         flattenWhere(basicMap, {
//           entity: {
//             $in: [
//               { id: 123, subId: 456 },
//               { id: 987, subId: 654 },
//             ],
//           },
//         }),
//       ).toEqual([
//         { 'entity.id': { $eq: 123 }, 'entity.subId': { $eq: 456 } },
//         { 'entity.id': { $eq: 987 }, 'entity.subId': { $eq: 654 } },
//       ]);
//     });
//
//     it('should handle single value $nin', () => {
//       expect(flattenWhere(basicMap, { foo: { $nin: [123] } })).toEqual([
//         { foo: { $ne: 123 } },
//       ]);
//     });
//
//     it('should handle multi value $nin', () => {
//       expect(flattenWhere(basicMap, { foo: { $nin: [123, 456] } })).toEqual([
//         { foo: { $nin: [123, 456] } },
//       ]);
//     });
//
//     it('should handle single object value $nin', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $nin: [{ id: 123 }] } }),
//       ).toEqual([{ 'entity.id': { $ne: 123 } }]);
//     });
//
//     it('should handle multi object value $nin', () => {
//       expect(
//         flattenWhere(basicMap, {
//           entity: { $nin: [{ id: 123 }, { id: 456 }] },
//         }),
//       ).toEqual([{ 'entity.id': { $nin: [123, 456] } }]);
//     });
//
//     it('should handle single object multi value $nin', () => {
//       expect(
//         flattenWhere(basicMap, { entity: { $nin: [{ id: 123, subId: 456 }] } }),
//       ).toEqual([
//         { 'entity.id': { $ne: 123 } },
//         { 'entity.id': { $eq: 123 }, 'entity.subId': { $ne: 456 } },
//       ]);
//     });
//
//     it('should handle multi object multi value $nin', () => {
//       expect(
//         flattenWhere(basicMap, {
//           entity: {
//             $nin: [
//               { id: 123, subId: 456 },
//               { id: 987, subId: 654 },
//             ],
//           },
//         }),
//       ).toEqual([
//         { 'entity.id': { $nin: [123, 987] } },
//         { 'entity.id': { $eq: 123 }, 'entity.subId': { $ne: 456 } },
//         { 'entity.id': { $eq: 987 }, 'entity.subId': { $ne: 654 } },
//       ]);
//     });
//   });
// });

export {};
