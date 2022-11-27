// import {
//   StateDefinition,
//   StateDefinitionWhereFields,
//   StateDefinitionWhereTerm,
// } from '@/definitions/index.js';
// import { MetadataCollectionFieldMap } from '@/metadata/index.js';
// import { Where } from '@/queries/index.js';
// import { getRecursiveWhereFields } from './collection.js';
//
// export type FlattenWhere = { [path: string]: StateDefinitionWhereTerm };
//
// export const flattenWhere = <S extends StateDefinition>(
//   fieldMap: MetadataCollectionFieldMap,
//   where: Where<S>,
// ): FlattenWhere[] => {
//   const res: FlattenWhere[] = [];
//
//   if (where.$or?.length > 0) {
//     res.push(
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       ...where.$or.flatMap((w: StateDefinitionWhereFields<any>) =>
//         flattenWhereFields(fieldMap, w),
//       ),
//     );
//   } else {
//     res.push(...flattenWhereFields(fieldMap, where));
//   }
//
//   return res;
// };
//
// const flattenWhereFields = (
//   fieldMap: MetadataCollectionFieldMap,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   where: StateDefinitionWhereFields<any>,
// ): FlattenWhere[] => {
//   let records: FlattenWhere[] = [{}];
//
//   for (const [path, term] of Object.entries(where)) {
//     if (term == null) continue;
//
//     for (const [operator, value] of Object.entries(term)) {
//       records = flattenWhereOperator(fieldMap, records, path, operator, value);
//     }
//   }
//
//   return records;
// };
//
// const flattenWhereOperator = (
//   fieldMap: MetadataCollectionFieldMap,
//   records: FlattenWhere[],
//   path: string,
//   operator: string,
//   value: unknown,
// ): FlattenWhere[] => {
//   switch (operator) {
//     case '$eq':
//     case '$gt':
//     case '$gte':
//     case '$lt':
//     case '$lte':
//     case '$contains':
//     case '$startsWith':
//     case '$endsWith': {
//       return flattenWherePlainOperator(
//         fieldMap,
//         records,
//         path,
//         operator,
//         value,
//       );
//     }
//
//     case '$ne': {
//       return flattenWhereNotEqual(fieldMap, records, path, value);
//     }
//
//     case '$in': {
//       if (!Array.isArray(value)) {
//         throw new TypeError(`Expected array for '${operator}' operator`);
//       }
//
//       return flattenWhereIn(fieldMap, records, path, value);
//     }
//
//     case '$nin': {
//       if (!Array.isArray(value)) {
//         throw new TypeError(`Expected array for '${operator}' operator`);
//       }
//
//       return flattenWhereNotIn(fieldMap, records, path, value);
//     }
//
//     default: {
//       throw new Error(`Unknown where operator: '${operator}'`);
//     }
//   }
// };
//
// // operators
//
// const flattenWherePlainOperator = (
//   fieldMap: MetadataCollectionFieldMap,
//   records: FlattenWhere[],
//   path: string,
//   operator: string,
//   value: unknown,
// ): FlattenWhere[] => {
//   const fieldsValues = getRecursiveWhereFields(fieldMap, path, value);
//
//   for (const [fieldPath, fieldValue] of fieldsValues) {
//     const term: StateDefinitionWhereTerm = { [operator]: fieldValue } as never;
//
//     for (const record of records) {
//       setWhereTerm(record, fieldPath, term);
//     }
//   }
//
//   return records;
// };
//
// const flattenWhereNotEqual = (
//   fieldMap: MetadataCollectionFieldMap,
//   records: FlattenWhere[],
//   path: string,
//   value: unknown,
// ): FlattenWhere[] => {
//   const fieldsValues = getRecursiveWhereFields(fieldMap, path, value);
//   const res = [];
//
//   for (const [fieldPath, fieldValue] of fieldsValues) {
//     const curr = records.map((record) => ({ ...record }));
//
//     for (const record of curr) {
//       setWhereTerm(record, fieldPath, {
//         $ne: fieldValue,
//       });
//     }
//
//     res.push(...curr);
//   }
//
//   return res;
// };
//
// const flattenWhereIn = (
//   fieldMap: MetadataCollectionFieldMap,
//   records: FlattenWhere[],
//   path: string,
//   values: unknown[],
// ): FlattenWhere[] => {
//   const res = [];
//
//   const [self] = lookupWherePath(fieldMap, path, values);
//   if (self) {
//     const curr = records.map((record) => ({ ...record }));
//
//     for (const record of curr) {
//       setWhereTerm(record, path, {
//         $in: values,
//       });
//     }
//
//     res.push(...curr);
//   }
//
//   for (const value of values) {
//     const fieldsValues = [
//       ...getRecursiveWhereInFields(fieldMap, path, value as object),
//     ];
//     if (!fieldsValues.length) continue;
//
//     const curr = records.map((record) => ({ ...record }));
//
//     for (const [fieldPath, fieldValue] of fieldsValues) {
//       for (const record of curr) {
//         setWhereTerm(record, fieldPath, {
//           $eq: fieldValue,
//         });
//       }
//     }
//
//     res.push(...curr);
//   }
//
//   return res;
// };
//
// const flattenWhereNotIn = (
//   fieldMap: MetadataCollectionFieldMap,
//   records: FlattenWhere[],
//   path: string,
//   values: unknown[],
// ): FlattenWhere[] => {
//   const res = [];
//
//   // sort paths by field position
//   const progressiveFields: [path: string, value: unknown][][] = [];
//   for (const value of values) {
//     const fieldsValues = [...getRecursiveWhereFields(fieldMap, path, value)];
//
//     for (const [i, pathValue] of fieldsValues.entries()) {
//       let list = progressiveFields[i];
//
//       if (!list) {
//         list = [];
//         progressiveFields[i] = list;
//       }
//
//       list.push(pathValue);
//     }
//   }
//
//   for (const [i, fieldsValues] of progressiveFields.entries()) {
//     const base = records.map((record) => ({ ...record }));
//
//     // set field at i to $ne
//     for (const [fieldPath, fieldValue] of fieldsValues) {
//       for (const record of base) {
//         setWhereTerm(record, fieldPath, {
//           $ne: fieldValue,
//         });
//       }
//     }
//
//     // set all fields from [0, i) to $eq
//     for (let j = 0; j < i; j++) {
//       for (const [fieldPath, fieldValue] of progressiveFields[j]) {
//         for (const record of base) {
//           setWhereTerm(record, fieldPath, {
//             $eq: fieldValue,
//           });
//         }
//       }
//     }
//
//     res.push(...base);
//   }
//
//   return res;
// };
//
// // setters
//
// const setWhereTerm = (
//   record: FlattenWhere,
//   path: string,
//   term: StateDefinitionWhereTerm,
// ): void => {
//   const exists = record[path] as never as Record<string, unknown> | undefined;
//
//   if (exists == null) {
//     record[path] = term;
//     return;
//   }
//
//   for (const [op, val] of Object.entries(term)) {
//     if (op === '$ne') {
//       if ('$ne' in exists && !Array.isArray(exists.$nin)) {
//         exists.$ne = val;
//         continue;
//       }
//
//       const $nin = (exists.$nin ?? (exists.$nin = [])) as unknown[];
//       $nin.push(val);
//
//       if ('$ne' in exists) {
//         $nin.push(exists.$ne);
//         delete exists.$ne;
//       }
//       continue;
//     }
//
//     if (!(op in exists)) {
//       exists[op as never] = val as never;
//       continue;
//     }
//
//     throw new Error(`Duplicate where operator: '${op}'`);
//   }
// };

export {};
