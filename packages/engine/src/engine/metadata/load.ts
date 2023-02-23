import { neuledgeGlob } from '@/glob';
import { Metadata } from '@/metadata';
import { Store } from '@neuledge/store';
import { ensureStoreCollections } from './collections';
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
  // init collection for metadata
  const metadataCollection = getMetadataCollection(metadataCollectionName);
  await ensureMetadataCollection(store, metadataCollection);

  // generate metadata for current states
  const metadata = new Metadata(neuledgeGlob.stateDefinitions.values());

  // load previous metadata snapshot from the store
  const snapshot = await getStoreMetadataSnapshot(
    metadata,
    store,
    metadataCollection,
  );

  // sync metadata with previous snapshot and generate change list
  const changes = metadata.sync(snapshot);

  // update database collections and indexes
  await ensureStoreCollections(store, metadata);

  // update metadata snapshot in the store
  await syncStoreMetadata(store, metadataCollection, changes);

  return metadata;
};
