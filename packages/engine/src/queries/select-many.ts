import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { OffsetQuery } from './offset.js';
import { SelectQuery } from './select.js';

export interface SelectManyQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'SelectMany', S, S, R>,
    FilterQuery<S>,
    LimitQuery,
    OffsetQuery {}
