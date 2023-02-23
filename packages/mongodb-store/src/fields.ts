import { StorePrimaryKey } from '@neuledge/store';

export const escapeFieldName = (
  primaryKey: StorePrimaryKey,
  name: string,
): string => {
  if (primaryKey.fields[name]) {
    if (Object.keys(primaryKey.fields).length === 1) return '_id';

    return `_id.${name}`;
  }

  switch (name) {
    case '_id': {
      return `${name}_org`;
    }

    default: {
      return name.endsWith('_org') ? `${name}_org` : name;
    }
  }
};

export const unescapeFieldName = (name: string): string =>
  name.endsWith('_org') ? name.slice(0, -4) : name;
