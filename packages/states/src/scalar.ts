import { Scalar as BuiltInScalar, types } from '@neuledge/scalars';
import { ScalarNode } from '@neuledge/states-parser';

export type Scalar = BuiltInScalar & { node?: never };

export interface CustomScalar<Name extends string = string> {
  type: 'Scalar';
  node?: ScalarNode;
  name: Name;
  description?: string;
  deprecated?: string | true;
}

export const builtInScalars: { [K in string]: Scalar & { name: K } } =
  Object.fromEntries(
    Object.values(types)
      .filter((value): value is Scalar => value?.type === 'Scalar')
      .map((value) => [value.name, value]),
  );
