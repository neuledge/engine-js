import { TokensParser } from '@/tokens/index.js';
import { EitherNode } from './either.js';
import { ImportNode, parseImportNodes } from './import.js';
import { parseStateNode, StateNode } from './state.js';

export interface RootNode {
  type: 'Root';
  imports: ImportNode[];
  body: RootBodyNode[];
}

export type RootBodyNode = StateNode | EitherNode;

export const parseRootNode = (cursor: TokensParser): RootNode => ({
  type: 'Root',
  imports: parseImportNodes(cursor),
  body: parseRootBodyNodes(cursor),
});

const parseRootBodyNodes = (cursor: TokensParser): RootBodyNode[] => {
  const body: RootBodyNode[] = [];
  while (cursor.current) {
    body.push(parseStateNode(cursor));
  }

  return body;
};
