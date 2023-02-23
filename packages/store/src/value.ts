export type StoreScalarValue =
  | null
  | string
  | number
  | bigint
  | boolean
  | Buffer
  | Date
  | { [key in string]?: StoreScalarValue }
  | StoreScalarValue[];

export const isStoreScalarValueEqual = (
  a: StoreScalarValue | undefined,
  b: StoreScalarValue | undefined,
): boolean => {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (a === null || b === null) {
    return false;
  }

  if (a instanceof Buffer) {
    if (!(b instanceof Buffer)) {
      return false;
    }

    return a.equals(b);
  }

  if (a instanceof Date) {
    if (!(b instanceof Date)) {
      return false;
    }

    return a.getTime() === b.getTime();
  }

  if (b instanceof Buffer || b instanceof Date) {
    return false;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    return a.every((v, i) => isStoreScalarValueEqual(v, b[i]));
  }

  if (Array.isArray(b)) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every((key) => isStoreScalarValueEqual(a[key], b[key]));
};

export const uniqueStoreScalarValues = <T extends StoreScalarValue | undefined>(
  values: T[],
): T[] => [
  ...new Map(
    values.map((value) => [getStoreScalarValueKey(value), value]),
  ).values(),
];

export const getStoreScalarValueKey = (
  value: StoreScalarValue | undefined,
): string | number | bigint | boolean | null => {
  switch (typeof value) {
    case 'number':
    case 'bigint':
    case 'boolean': {
      return value;
    }

    case 'undefined': {
      return null;
    }

    case 'string': {
      return JSON.stringify(value);
    }

    case 'object': {
      if (value === null) {
        return value;
      }

      if (value instanceof Buffer) {
        return value.toString('base64');
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      if (Array.isArray(value)) {
        return `[${value.map((v) => getStoreScalarValueKey(v)).join(',')}]`;
      }

      return `{${Object.entries(value)
        .map(([k, v]) => `${JSON.stringify(k)}:${getStoreScalarValueKey(v)}`)
        .join(',')}}`;
    }
  }
};
