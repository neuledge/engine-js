import { TokensParser, TokenType } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';

export interface IdentifierNode extends AbstractNode<'Identifier'> {
  name: string;
}

export const parseIdentifierNode = (cursor: TokensParser): IdentifierNode => ({
  type: 'Identifier',
  start: cursor.start,
  name: cursor.consume(TokenType.WORD, null, `identifier name`).name,
  end: cursor.end,
});
