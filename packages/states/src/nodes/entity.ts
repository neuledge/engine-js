import { EitherNode } from './either.js';
import { ScalarNode } from './scalar.js';
import { StateNode } from './state.js';

export type EntityNode = ScalarNode | StateNode | EitherNode;
