import {
  CallableScalar,
  Scalar as BuiltInScalar,
  types,
} from '@neuledge/scalars';
import { ScalarNode } from '@neuledge/states-parser';

export type Scalar = BuiltInScalar & { node?: never };

export interface CustomScalar<Name extends string = string>
  extends BuiltInScalar {
  type: Scalar['type'];
  name: Name;
  node?: ScalarNode;
}

export const builtInScalars: { [K in string]: Scalar & { name: K } } =
  Object.fromEntries(
    (Object.values(types) as CallableScalar[])
      .filter((value): value is CallableScalar => value?.type === 'Scalar')
      .map((value) => [value.name, value]),
  );
