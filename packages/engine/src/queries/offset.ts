import { EntityListOffset } from '@/list';

export interface OffsetQuery {
  /**
   * Skip previous entities and start returning entities from the given offset.
   * Use the `nextOffset` property of the previously returned entity list to get
   * the next offset.
   */
  offset(offset: EntityListOffset | null): this;
}

export interface OffsetQueryOptions {
  offset?: EntityListOffset | null;
}
