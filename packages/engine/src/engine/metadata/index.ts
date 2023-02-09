import { neuledgeGlob } from '@/glob';
import { Metadata } from '@/metadata';
import { Store } from '@neuledge/store';
import {
  ensureMetadataCollection,
  getMetadataCollection,
  getStoreMetadataSnapshot,
  syncStoreMetadata,
} from './store';

const DEFAULT_METADATA_COLLECTION_NAME = '__neuledge_metadata';

export const loadMetadata = async (
  store: Store,
  metadataCollectionName: string = DEFAULT_METADATA_COLLECTION_NAME,
): Promise<Metadata> => {
  const metadataCollection = getMetadataCollection(metadataCollectionName);
  await ensureMetadataCollection(store, metadataCollection);

  const metadata = new Metadata(neuledgeGlob.stateDefinitions.values());
  const changes = metadata.sync(
    await getStoreMetadataSnapshot(metadata, store, metadataCollection),
  );

  // FIXME handle changes
  // for (const change of changes) {
  // }

  await syncStoreMetadata(store, metadataCollection, changes);

  return metadata;
};
