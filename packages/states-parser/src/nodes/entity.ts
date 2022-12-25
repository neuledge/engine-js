import { EitherNode } from './either';
import { ScalarNode } from './scalar';
import { StateNode } from './state';

export type EntityNode = ScalarNode | StateNode | EitherNode;
