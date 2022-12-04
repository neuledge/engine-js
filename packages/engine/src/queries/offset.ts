import { EntityListOffset } from '@/list';

export interface OffsetQuery {
  offset(offset: EntityListOffset | null): this;
}

export interface OffsetQueryOptions {
  offset?: EntityListOffset;
}
