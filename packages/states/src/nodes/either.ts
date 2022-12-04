import { IdentifierNode } from './identifier';
import { NamedNode } from './named';

export interface EitherNode extends NamedNode<'Either'> {
  states: IdentifierNode[];
}
