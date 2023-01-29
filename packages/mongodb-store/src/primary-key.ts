import { StoreCollection, StoreError } from '@neuledge/store';
import { Collection } from 'mongodb';

export interface AutoIncrementDocument {
  _id: string;
  value: number;
}

/**
 * Get the insearted id for a document. If the document does not have a primary
 * key, and the index has an auto-increment primary key, this function will
 * generate the primary key for the document.
 */
export const generateDocumentInsertedId = async <T>(
  autoIncrement: Collection<AutoIncrementDocument>,
  { name, primaryKey }: StoreCollection,
  doc: T,
): Promise<Partial<T>> => {
  const keys = Object.keys(primaryKey.fields) as (keyof T)[];
  const insertedId: Partial<T> = {};

  for (const key of keys) {
    if (doc[key] != null) {
      insertedId[key] = doc[key];
      continue;
    }

    switch (primaryKey.auto) {
      case 'increment': {
        if (keys.length > 1) {
          throw new StoreError(
            StoreError.Code.NOT_SUPPORTED,
            `Auto-increment primary key is not supported for compound primary keys`,
          );
        }

        const value = await autoIncrementPrimaryKey(autoIncrement, name);
        insertedId[key] = value as T[keyof T];

        break;
      }

      default: {
        throw new StoreError(
          StoreError.Code.INVALID_INPUT,
          `A primary key '${key as string}' is missing from the given document`,
        );
      }
    }
  }

  return insertedId;
};

const autoIncrementPrimaryKey = async (
  autoIncrement: Collection<AutoIncrementDocument>,
  collectionName: string,
): Promise<number> => {
  const { value: doc } = await autoIncrement.findOneAndUpdate(
    {
      _id: collectionName,
    },
    {
      $inc: { value: 1 },
    },
    {
      upsert: true,
    },
  );

  return (doc?.value ?? 0) + 1;
};
