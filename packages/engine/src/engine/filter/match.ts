import { StateDefinition } from '@/definitions/index.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { StoreMatch } from '@/store/index.js';
import { Match } from '@/queries/index.js';

export const convertMatch = <S extends StateDefinition>(
  metadata: Metadata,
  collection: MetadataCollection,
  match: Match<S>,
): StoreMatch => {
  const res: StoreMatch = {};

  //   for (const key in match) {
  //     const matchOpts = match[key];
  //     if (matchOpts == null) continue;
  //
  //     const fields = collection.getFields(key);
  //     if (!fields.length) continue;
  //
  //     const relCollections = metadata.getCollections(
  //       matchOpts.states ?? getCollectionRelationStates(collection, key),
  //     );
  //
  //     for (const relCollection of relCollections) {
  //       const relOptions = convertFilterQueryOptions(
  //         metadata,
  //         relCollection,
  //         matchOpts,
  //       );
  //
  //       assignMatchFields(res, fields, relOptions);
  //     }
  //   }

  return res;
};

// const convertFilterQueryOptions = <S extends StateDefinition>(
//   metadata: Metadata,
//   collection: MetadataCollection,
//   matchOpts: FilterQueryOptions<S>,
// ): Pick<StoreMatchOptions, 'where' | 'match'> => ({
//   ...(matchOpts.where
//     ? { where: convertWhere(collection, matchOpts.where) }
//     : null),
//
//   ...(matchOpts.match
//     ? { match: convertMatch(metadata, collection, matchOpts.match) }
//     : null),
// });

// const assignMatchFields = (
//   match: StoreMatch,
//   fields: MetadataOriginStateField[],
//   relOptions: Partial<StoreMatchOptions>,
// ) => {
//   for (const field of fields) {
//     const { name, relations } = field;
//
//     if (!relations?.length) {
//       throw new Error(`Field '${name}' is not a relation`);
//     }
//
//     match[name] = [
//       ...(match[name] ?? []),
//       ...new Map(
//         relations
//           .map(({ state, path }): [string, StoreMatchOptions] | null => {
//             const relField = state.fields.find((f) => f.path === path);
//
//             if (!relField) {
//               return null;
//             }
//
//             return [
//               `${state.collectionName}.${relField?.name}`,
//               {
//                 collectionName: state.collectionName,
//                 by: { [name]: relField?.name },
//                 ...relOptions,
//               },
//             ];
//           })
//           .filter((v): v is [string, StoreMatchOptions] => v != null),
//       ).values(),
//     ];
//   }
// };
