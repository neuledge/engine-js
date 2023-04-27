import { StoreDocument } from '@neuledge/store';

export const convertRawDocument = (rawDoc: StoreDocument): StoreDocument => {
  const doc: StoreDocument = {};

  // split by dot notation
  for (const [key, value] of Object.entries(rawDoc)) {
    const path = key.split('.');

    let current = doc;
    for (let i = 0; i < path.length; i++) {
      const name = path[i];

      if (i === path.length - 1) {
        current[name] = value;
      } else {
        current = current[name] = (current[name] || {}) as StoreDocument;
      }
    }
  }

  preferLowerChoices(doc);

  return doc;
};

const preferLowerChoices = (doc: StoreDocument): void => {
  for (const [key, value] of Object.entries(doc).sort()) {
    const choice = key.match(/^(.+)\$(\d+)$/);
    if (!choice) continue;

    delete doc[key];

    const name = choice[1];
    if (name in doc) continue;

    doc[name] = value;

    preferLowerChoices(value as StoreDocument);
  }
};
