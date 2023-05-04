import { StoreIndex, StorePrimaryKey } from '@neuledge/store';

export interface SQLIndexAttribute {
  index_name: string;
  column_name: string;
  seq_in_index: number;
  direction: 'ASC' | 'DESC';
  is_unique: boolean | 1 | 0;
}

export interface SQLIndexColumn extends SQLIndexAttribute {
  is_primary: boolean | 1 | 0;
  is_auto_increment: boolean | 1 | 0;
}

export const toStoreIndex = (
  indexColumns: SQLIndexColumn[],
): StoreIndex | StorePrimaryKey => {
  const { index_name, is_unique, is_primary, is_auto_increment } =
    indexColumns[0];

  const index: StoreIndex | StorePrimaryKey = {
    name: index_name,
    unique: !!is_unique,
    fields: {},
  };

  if (index.unique && is_primary) {
    index.unique = 'primary';

    if (is_auto_increment) {
      (index as StorePrimaryKey).auto = 'increment';
    }
  }

  indexColumns.sort((a, b) => a.seq_in_index - b.seq_in_index);

  for (const statistic of indexColumns) {
    index.fields[statistic.column_name] = {
      sort: statistic.direction === 'ASC' ? 'asc' : 'desc',
    };
  }

  return index;
};
