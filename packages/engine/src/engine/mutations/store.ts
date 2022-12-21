import { MetadataCollection } from '@/metadata';
import {
  Store,
  StoreDocument,
  StoreWhere,
  StoreWhereEquals,
  StoreWhereRecord,
} from '@neuledge/store';
import pLimit from 'p-limit';

// update

export const alterStoreDocuments = async (
  store: Store,
  collection: MetadataCollection,
  documents: StoreDocument[],
  updates: (StoreDocument | null)[],
): Promise<boolean[]> => {
  const asyncLimit = pLimit(10);
  const deleteDocuments: StoreDocument[] = [];

  const res = await Promise.all(
    documents.map((document, index) => {
      const updated = updates[index];

      if (updated == null) {
        deleteDocuments.push(document);
        return true;
      }

      return asyncLimit(() =>
        updateStoreDocument(store, collection, document, updated),
      );
    }),
  );

  if (deleteDocuments.length) {
    await deleteStoreDocuments(store, collection, deleteDocuments);
  }

  return res;
};

const updateStoreDocument = async (
  store: Store,
  collection: MetadataCollection,
  document: StoreDocument,
  updated: StoreDocument,
): Promise<boolean> => {
  const setEntries = Object.entries(updated).filter(
    ([key, value]) => value !== document[key],
  );
  if (!setEntries.length) {
    return true;
  }

  const res = await store.update({
    collectionName: collection.name,
    where: getWhereRecordByPrimaryKeys(collection, document),
    set: Object.fromEntries(setEntries),
    limit: 1,
  });

  return !!res.affectedCount;
};

// delete

const deleteStoreDocuments = async (
  store: Store,
  collection: MetadataCollection,
  documents: StoreDocument[],
): Promise<void> => {
  await store.delete({
    collectionName: collection.name,
    where: getWhereByPrimaryKeys(collection, documents),
    limit: documents.length,
  });
};

// const deleteStoreDocument = async (
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

const getWhereByPrimaryKeys = (
  collection: MetadataCollection,
  documents: StoreDocument[],
): StoreWhere => ({
  $or: documents.map((document) =>
    getWhereRecordByPrimaryKeys(collection, document),
  ),
});

const getWhereRecordByPrimaryKeys = (
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
