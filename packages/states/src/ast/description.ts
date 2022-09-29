import { TokensParser, TokenType } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';

export interface DescriptionNode extends AbstractNode<'Description'> {
  value: string;
}

export const parseMaybeDescriptionNode = (
  cursor: TokensParser,
): DescriptionNode | undefined => {
  const start = cursor.start;

  const strToken = cursor.maybeConsume(
    TokenType.STRING,
    (token) => token.kind === '"' || token.kind === '"""',
  );

  return (
    strToken && {
      type: 'Description',
      start,
      end: cursor.end,
      value: strToken.value,
    }
  );
};
