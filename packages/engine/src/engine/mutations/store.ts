import { MetadataCollection } from '@/metadata';
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
  await Promise.all(
    documents.map((document, index) =>
      updateStoreDocument(store, collection, document, updated[index]),
    ),
  );
};

const updateStoreDocument = async (
  store: Store,
  collection: MetadataCollection,
  document: StoreDocument,
  updated: StoreDocument,
): Promise<void> => {
  const setEntries = Object.entries(updated).filter(
    ([key, value]) => value !== document[key],
  );
  if (!setEntries.length) return;

  await store.update({
    collectionName: collection.name,
    where: getWhereRecord(collection, document),
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
    where: getWhere(collection, documents),
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
  collection: MetadataCollection,
  documents: StoreDocument[],
): StoreWhere => ({
  $or: documents.map((document) => getWhereRecord(collection, document)),
});

const getWhereRecord = (
  collection: MetadataCollection,
  document: StoreDocument,
): StoreWhereRecord =>
  Object.fromEntries([
    ...collection.primaryKeys.map((key): [string, StoreWhereEquals] => [
      key,
      { $eq: document[key] ?? null },
    ]),
    [
      collection.reservedNames.hash,
      { $eq: document[collection.reservedNames.hash] ?? null },
    ],
    [
      collection.reservedNames.version,
      { $eq: document[collection.reservedNames.version] ?? 0 },
    ],
  ]);
