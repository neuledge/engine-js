import { EntityListOffset } from '@/list.js';

export interface OffsetQuery {
  offset(offset: EntityListOffset | null): this;
}
