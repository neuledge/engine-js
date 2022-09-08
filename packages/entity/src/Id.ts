import { StateConstractor } from '@neuledge/state';

export type EntityId<T extends StateConstractor<InstanceType<T>>> = {
  [K in T['$$PrimaryKeys'][number]]: InstanceType<T>[K];
};
