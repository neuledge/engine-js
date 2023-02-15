import { State } from './state';

export interface StateSortingIndex {
  name: string;
  fields: Record<string, 'asc' | 'desc'>;
  unique?: boolean;
}

export interface StatePrimaryKey extends StateSortingIndex {
  unique: true;
  auto?: 'increment';
}

export const StateIndexNameRegex = /^[\w.]+$/i;

export const isStateSortingIndexEquals = (
  sa: State,
  ia: StateSortingIndex,
  sb: State,
  ib: StateSortingIndex,
): boolean => {
  if (
    !ia.unique !== !ib.unique &&
    (ia as StatePrimaryKey).auto !== (ib as StatePrimaryKey).auto
  ) {
    return false;
  }

  const a_keys = Object.keys(ia.fields);
  const b_keys = Object.keys(ib.fields);

  if (a_keys.length !== b_keys.length) {
    return false;
  }

  return a_keys.every((ak, i) => {
    const bk = b_keys[i];

    return (
      ia.fields[ak] === ib.fields[bk] &&
      sa.fields[ak].as.entity.name === sb.fields[bk].as.entity.name &&
      !sa.fields[ak].as.list === !sb.fields[bk].as.list &&
      !sa.fields[ak].nullable === !sb.fields[bk].nullable
    );
  });
};
