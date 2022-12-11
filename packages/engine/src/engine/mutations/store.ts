import { ENTITY_METADATA_HASH_FIELD, MetadataCollection } from '@/metadata';
import {
  Store,
  StoreDocument,
  StoreWhere,
  StoreWhereEquals,
  StoreWhereRecord,
} from '@/store';

// update

export const updateStoreDocuments = async (
  store: Store,
  collection: MetadataCollection,
  documents: StoreDocument[],
  updated: StoreDocument[],
): Promise<void> => {
  const { primaryKeys } = collection;

  await Promise.all(
    documents.map((document, index) =>
      updateStoreDocument(
        store,
        collection,
        primaryKeys,
        document,
        updated[index],
      ),
    ),
  );
};

const updateStoreDocument = async (
  store: Store,
  collection: MetadataCollection,
  primaryKeys: string[],
  document: StoreDocument,
  updated: StoreDocument,
): Promise<void> => {
  const setEntries = Object.entries(updated).filter(
    ([key, value]) => value !== document[key],
  );
  if (!setEntries.length) return;

  await store.update({
    collectionName: collection.name,
    where: getWhereRecord(primaryKeys, document),
    set: Object.fromEntries(setEntries),
    limit: 1,
  });
};

// delete

export const deleteStoreDocuments = async (
  store: Store,
  collection: MetadataCollection,
  documents: StoreDocument[],
): Promise<void> => {
  await store.delete({
    collectionName: collection.name,
    where: getWhere(collection.primaryKeys, documents),
    limit: documents.length,
  });
};

// export const deleteStoreDocument = async (
//   store: Store,
//   collection: MetadataCollection,
//   document: StoreDocument,
// ): Promise<void> => {
//   await store.delete({
//     collectionName: collection.name,
//     where: getWhereRecord(collection.primaryKeys, document),
//     limit: 1,
//   });
// };

// store where

const getWhere = (
  primaryKeys: string[],
  documents: StoreDocument[],
): StoreWhere => ({
  $or: documents.map((document) => getWhereRecord(primaryKeys, document)),
});

const getWhereRecord = (
  primaryKeys: string[],
  document: StoreDocument,
): StoreWhereRecord =>
  Object.fromEntries([
    ...primaryKeys.map((key): [string, StoreWhereEquals] => [
      key,
      { $eq: document[key] ?? null },
    ]),
    // FIXME use version field
    [
      ENTITY_METADATA_HASH_FIELD,
      { $eq: document[ENTITY_METADATA_HASH_FIELD] ?? null },
    ],
  ]);
