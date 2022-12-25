import { NamedNode } from './named';
import { TypeGeneratorNode } from './type';

export interface ScalarNode extends NamedNode<'Scalar'> {
  from: TypeGeneratorNode[];
}
