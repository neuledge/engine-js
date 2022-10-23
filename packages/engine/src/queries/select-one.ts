import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { FilterQuery } from './filter.js';
import { SelectQuery } from './select.js';

export interface SelectOneQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'SelectOne', S, S, R>,
    FilterQuery<S> {}
