import { Metadata } from '@/metadata/index.js';
import { Store } from '@/store/index.js';
import {
  ensureStoreMetadata,
  getStoreMetadata,
  syncStoreMetadata,
} from './store.js';

const DEFAULT_COLLECTION_NAME = '__neuledge_metadata';

export const loadMetadata = async (
  store: Store,
  collectionName: string = DEFAULT_COLLECTION_NAME,
): Promise<Metadata> => {
  await ensureStoreMetadata(store, collectionName);

  const metadata = Metadata.generate().sync(
    await getStoreMetadata(store, collectionName),
  );

  for (const change of metadata.changes) {
    // FIXME handle changes
  }

  await syncStoreMetadata(store, collectionName, metadata.changes);

  return metadata;
};
