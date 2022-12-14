export const escapeFieldName = (name: string): string => {
  switch (name) {
    case '_id':
      return `${name}_org`;

    default:
      return name.endsWith('_org') ? `${name}_org` : name;
  }
};

export const unescapeFieldName = (name: string): string =>
  name.endsWith('_org') ? name.slice(0, -4) : name;
