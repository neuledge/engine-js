import { NamedNode } from './named.js';
import { TypeGeneratorNode } from './type.js';

export interface ScalarNode extends NamedNode<'Scalar'> {
  from: TypeGeneratorNode[];
}
