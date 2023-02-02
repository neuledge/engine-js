import { Entity } from '@/entity';
import { StateDefinition } from '@/definitions';
import { ChildQueryOptions } from './type';
import { WhereQuery, WhereQueryOptions } from './where';
import { MatchQuery, MatchQueryOptions } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';
import { SelectQuery, SelectQueryOptions } from './select';

export interface SelectOneQuery<S extends StateDefinition, R = Entity<S>>
  extends SelectQuery<'SelectOne', S, S, R>,
    IncludeQuery<'SelectOne', S, S, R>,
    RequireQuery<'SelectOne', S, S, R>,
    WhereQuery<S>,
    MatchQuery<S> {}

export interface SelectOneQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends ChildQueryOptions<'SelectOne', I>,
    SelectQueryOptions<O>,
    IncludeQueryOptions<O>,
    RequireQueryOptions<O>,
    WhereQueryOptions<I>,
    MatchQueryOptions<I> {}
