import { EntityId } from '@/Id.js';
import { EntityList } from '@/List.js';
import { Projection } from '@/Projection.js';
import { Scalar } from '@neuledge/scalar';
import { ArrayType, State, StateFieldType, UnionType } from '@neuledge/state';
import { Entity, EntityCreate } from './index.js';
import {
  NullableKeys,
  ProjectionNullableKeys,
  ProjectionRequiredKeys,
  RequiredKeys,
} from './keys.js';

export type EntityData<P extends Projection<S>, S extends State> = {
  [K in ProjectionRequiredKeys<P, S>]: EntityFieldType<
    S['schema'][K]['type'],
    P[K]
  >;
} & {
  [K in ProjectionNullableKeys<P, S>]?: EntityFieldType<
    S['schema'][K]['type'],
    P[K]
  >;
};

export type EntityCreateData<S extends State> = {
  [K in RequiredKeys<S>]: EntityFieldData<S['schema'][K]['type']>;
} & {
  [K in NullableKeys<S>]?: EntityFieldData<S['schema'][K]['type']> | null;
};

export type EntityUpdateData<S extends State> = {
  [K in keyof S['schema']]?: EntityFieldData<S['schema'][K]['type']> | null;
};

// field helpers

type EntityFieldType<T extends StateFieldType, P> = [T] extends [
  ArrayType<UnionType<State>>,
]
  ? [P] extends [Projection<T[0][number]>]
    ? EntityList<Entity<T[0][number], P>>
    : never
  : [T] extends [UnionType<State>]
  ? [P] extends [Projection<T[number]>]
    ? Entity<T[number], P>
    : never
  : [T] extends [ArrayType<Scalar<infer V, never>>]
  ? EntityList<V>
  : [T] extends [Scalar<infer V, never>]
  ? V
  : never;

type EntityFieldData<T extends StateFieldType> = [T] extends [
  ArrayType<UnionType<State>>,
]
  ? EntityFieldArrayData<EntityFieldStateData<T[0][number]>>
  : [T] extends [UnionType<State>]
  ? EntityFieldStateData<T[number]>
  : [T] extends [ArrayType<Scalar<never, infer I>>]
  ? EntityFieldArrayData<I>
  : [T] extends [Scalar<never, infer I>]
  ? I
  : never;

type EntityFieldStateData<S extends State> =
  | { connect: EntityId<S> }
  | { create: EntityCreate<S> };

type EntityFieldArrayData<T> = { set: T[] } | { add: T[] };
