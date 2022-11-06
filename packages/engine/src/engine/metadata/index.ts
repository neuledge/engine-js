import { stateDefinitions } from '@/index.js';
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

  const metadata = Metadata.generate(stateDefinitions.values());
  const changes = metadata.sync(await getStoreMetadata(store, collectionName));

  for (const change of changes) {
    // FIXME handle changes
  }

  await syncStoreMetadata(store, collectionName, changes);

  return metadata;
};
