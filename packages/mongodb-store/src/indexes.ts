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
    if (index.primary) {
      // FIXME handle primary index as an '_id' field
      // continue;
    }

    if (existMap.has(index.name)) continue;

    const indexSpec: Record<string, 1 | -1> = {};
    for (const indexField of index.fields) {
      indexSpec[escapeFieldName(indexField.field.name)] =
        indexField.order === 'asc' ? 1 : -1;
    }

    await collection.createIndex(indexSpec, {
      name: index.name,
      unique: index.unique || index.primary,
      background: true,
    });
  }
};
