import { stateDefinitions } from '@neuledge/engine';
import { Metadata } from '@/metadata';
import { Store } from '@/store';
import {
  ensureStoreMetadata,
  getStoreMetadata,
  syncStoreMetadata,
} from './store';

const DEFAULT_COLLECTION_NAME = '__neuledge_metadata';

export const loadMetadata = async (
  store: Store,
  collectionName: string = DEFAULT_COLLECTION_NAME,
): Promise<Metadata> => {
  await ensureStoreMetadata(store, collectionName);

  const metadata = Metadata.generate(stateDefinitions.values());
  const changes = metadata.sync(
    await getStoreMetadata(metadata, store, collectionName),
  );

  for (const change of changes) {
    // FIXME handle changes
  }

  await syncStoreMetadata(store, collectionName, changes);

  return metadata;
};
