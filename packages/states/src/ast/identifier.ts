import { TokensParser, TokenType } from '@/tokens/index.js';

export interface IdentifierNode {
  type: 'Identifier';
  name: string;
}

export const parseIdentifierNode = (cursor: TokensParser): IdentifierNode => ({
  type: 'Identifier',
  name: cursor.consume(TokenType.WORD, null, `identifier name`).name,
});
