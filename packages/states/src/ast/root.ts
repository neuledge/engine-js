import { TokensParser } from '@/tokens/index.js';
import { EitherNode } from './either.js';
import { ImportNode } from './import.js';
import { parseStateNode, StateNode } from './state.js';

export interface RootNode {
  type: 'Root';
  imports: ImportNode[];
  body: RootBodyNode[];
}

export type RootBodyNode = StateNode | EitherNode;

export const parseRootNode = (cursor: TokensParser): RootNode => {
  const body: RootBodyNode[] = [];
  while (cursor.current) {
    body.push(parseRootBodyNode(cursor));
  }

  return {
    type: 'Root',
    imports: [],
    body,
  };
};

const parseRootBodyNode = (cursor: TokensParser): RootBodyNode =>
  parseStateNode(cursor);
