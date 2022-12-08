import { StoreIndex } from '@neuledge/engine';
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

  // FIXME handle primary index as an '_id' field

  for (const index of indexes) {
    if (existMap.has(index.name)) continue;

    const indexSpec: Record<string, 1 | -1> = {};
    for (const field of index.fields) {
      indexSpec[escapeFieldName(field.name)] = field.order === 'asc' ? 1 : -1;
    }

    await collection.createIndex(indexSpec, {
      name: index.name,
      unique: index.unique || index.primary,
      background: true,
    });
  }
};
