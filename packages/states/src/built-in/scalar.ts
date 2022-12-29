import { ScalarNode } from '@neuledge/states-parser';

interface AnyScalar<Name extends string = string> {
  type: 'Scalar';
  node?: ScalarNode;
  name: Name;
  description?: string;
  deprecated?: string | true;
  builtIn?: boolean;
}

export interface Scalar<Name extends string = string> extends AnyScalar<Name> {
  node: ScalarNode;
}

export interface BuiltInScalar<Name extends string = string>
  extends AnyScalar<Name> {
  node?: never;
}
