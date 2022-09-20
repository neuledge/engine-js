export interface EntityList<T> extends Array<T> {
  nextOffset: EntityListOffset | null;
}

export type EntityListOffset = string | number | Buffer;

export const createEntityList = <T>(
  entries: T[],
  nextOffset: EntityList<T>['nextOffset'],
): EntityList<T> => Object.assign(entries, { nextOffset });
