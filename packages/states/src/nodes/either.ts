import { IdentifierNode } from './identifier.js';
import { NamedNode } from './named.js';

export interface EitherNode extends NamedNode<'Either'> {
  states: IdentifierNode[];
}
