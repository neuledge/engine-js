import { Metadata, MetadataCollection } from '@/metadata';
import { Store } from '@neuledge/store';
import pLimit from 'p-limit';

export const ensureStoreCollections = async (
  store: Store,
  metadata: Metadata,
): Promise<void> => {
  const asyncLimit = pLimit(1);

  await Promise.all(
    metadata.listCollections.map((collection) =>
      asyncLimit(() => ensureStoreCollection(store, collection)),
    ),
  );
};

const ensureStoreCollection = async (
  store: Store,
  collection: MetadataCollection,
): Promise<void> => {
  await store.ensureCollection({
    collection,
    indexes: Object.values(collection.indexes),
    fields: Object.values(collection.fields),
  });
};
