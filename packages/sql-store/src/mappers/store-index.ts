import { SQLStatistic } from '@/queries';
import { StoreError, StoreIndex, StorePrimaryKey } from '@neuledge/store';

export const toStoreIndexes = (
  statistics: SQLStatistic[],
): [primary: StorePrimaryKey, ...indexes: StoreIndex[]] => {
  const indexStatistics = groupTableStatistics(statistics);

  let primaryKey: StorePrimaryKey | undefined;
  const indexes: StoreIndex[] = [];

  for (const indexColumn of indexStatistics) {
    const index = toStoreIndex(indexColumn);

    if (index.unique === 'primary') {
      primaryKey = index as StorePrimaryKey;
    } else {
      indexes.push(index);
    }
  }

  if (!primaryKey) {
    throw new StoreError(
      StoreError.Code.INVALID_DATA,
      `Primary key not found for collection "${name}"`,
    );
  }

  return [primaryKey, ...indexes];
};

const toStoreIndex = (
  indexStatistics: SQLStatistic[],
): StoreIndex | StorePrimaryKey => {
  const { index_name, non_unique, column_extra } = indexStatistics[0];

  const index: StoreIndex | StorePrimaryKey = {
    name: index_name,
    unique: !non_unique,
    fields: {},
  };

  if (index.unique && index_name === 'PRIMARY') {
    index.unique = 'primary';

    if (column_extra === 'auto_increment') {
      (index as StorePrimaryKey).auto = 'increment';
    }
  }

  indexStatistics.sort((a, b) => a.seq_in_index - b.seq_in_index);

  for (const statistic of indexStatistics) {
    index.fields[statistic.column_name] = {
      sort: statistic.collation === 'A' ? 'asc' : 'desc',
    };
  }

  return index;
};

const groupTableStatistics = (statistics: SQLStatistic[]): SQLStatistic[][] => {
  const groupMap: Record<string, SQLStatistic[]> = {};

  for (const statistic of statistics) {
    let group = groupMap[statistic.index_name];
    if (!group) {
      group = [];
      groupMap[statistic.index_name] = group;
    }

    group.push(statistic);
  }

  return Object.values(groupMap);
};
