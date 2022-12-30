import { ScalarNode } from '@neuledge/states-parser';

export interface Scalar<Name extends string = string> {
  type: 'Scalar';
  node?: ScalarNode;
  name: Name;
  description?: string;
  deprecated?: string | true;
}

export interface BuiltInScalar<Name extends string = string>
  extends Scalar<Name> {
  node?: never;
}
