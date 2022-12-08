export const escapeFieldName = (name: string): string => {
  switch (name) {
    case '_id':
    case 'v':
      return `${name}_org`;

    default:
      return name.replace(/_org$/, '_org_org');
  }
};

export const unescapeFieldName = (name: string): string =>
  name.replace(/_org$/, '');
