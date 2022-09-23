import { TokensParser, TokenType } from '@/tokens/index.js';

export interface DescriptionNode {
  type: 'Description';
  value: string;
}

export const parseMaybeDescriptionNode = (
  cursor: TokensParser,
): DescriptionNode | undefined => {
  const strToken = cursor.maybeConsume(
    TokenType.STRING,
    (token) => token.kind === '"' || token.kind === '"""',
  );

  return (
    strToken && {
      type: 'Description',
      value: strToken.value,
    }
  );
};
