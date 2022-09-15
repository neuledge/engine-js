export interface EntityList<T> extends Array<T> {
  nextOffset: EntityListOffset | null;
}

export type EntityListOffset = string | number | Buffer;
