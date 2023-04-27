import { StoreDocument, StoreJoinChoice } from '@neuledge/store';

export const fillJoinedDocuments = (
  { innerJoin, leftJoin }: Pick<StoreJoinChoice, 'innerJoin' | 'leftJoin'>,
  rawDoc: StoreDocument,
  doc: StoreDocument,
): StoreDocument | null => {
  if (innerJoin) {
    for (const [key, choices] of Object.entries(innerJoin)) {
      const joinedDoc = findJoinedDocument(choices, rawDoc);
      if (!joinedDoc) return null;

      if (joinedDoc !== true) {
        doc[key] = joinedDoc;
      }
    }
  }

  if (leftJoin) {
    for (const [key, choices] of Object.entries(leftJoin)) {
      const joinedDoc = findJoinedDocument(choices, rawDoc);
      if (!joinedDoc) continue;

      if (joinedDoc !== true) {
        doc[key] = joinedDoc;
      }
    }
  }

  return doc;
};

// local helpers

const findJoinedDocument = (
  choices: StoreJoinChoice[],
  rawDoc: StoreDocument,
): StoreDocument | null | true => {
  for (const choice of choices) {
    const { collection, by, select } = choice;

    const found = Object.entries(by).every(([key, term]) => {
      const value = rawDoc[`${collection.name}.${key}`];
      if (value === undefined) return false;

      return term.field ? value === rawDoc[term.field] : value === term.value;
    });
    if (!found) continue;

    if (!select) {
      return true;
    }

    const keys =
      select === true
        ? Object.keys(collection.fields)
        : Object.keys(select).filter((key) => select[key]);

    return Object.fromEntries(
      keys.map((key) => [key, rawDoc[`${collection.name}.${key}`]]),
    );
  }

  return null;
};
