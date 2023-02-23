import { StoreIndex } from '@neuledge/store';
import { Collection } from 'mongodb';
import { escapeFieldName } from './fields';

export const dropIndexes = async (
  collection: Collection,
  indexes: string[],
): Promise<void> => {
  await Promise.all(indexes.map((index) => collection.dropIndex(index)));
};

export const ensureIndexes = async (
  collection: Collection,
  indexes: StoreIndex[],
): Promise<void> => {
  const exists = await collection.listIndexes().toArray();
  const existMap = new Map(exists.map((item) => [item.name, item]));

  for (const index of indexes) {
    if (index.unique === 'primary') {
      // we can't create a primary index on mongodb. We will use the default `_id` index
      // which is always unique and primary as our primary index and put all the primary
      // fields in it. See `escapeDocument()` for more details.
      continue;
    }

    if (existMap.has(index.name)) continue;

    const indexSpec: Record<string, 1 | -1> = {};

    for (const [name, indexField] of Object.entries(index.fields)) {
      indexSpec[escapeFieldName(name)] =
        indexField.direction === 'asc' ? 1 : -1;
    }

    // we will create the index in the background so that it doesn't block the
    // main thread. We will also create it as sparse so that it doesn't index
    // documents that don't have the indexed fields. This maintains the same
    // behavior with relational databases where NULL values are not indexed.

    await collection.createIndex(indexSpec, {
      name: index.name,
      unique: index.unique,
      sparse: true,
      background: true,
    });
  }
};
