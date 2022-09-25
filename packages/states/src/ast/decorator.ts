import { TokensParser } from '@/tokens/index.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

export interface DecoratorNode {
  type: 'Decorator';
  callee: IdentifierNode;
  arguments: ArgumentNode[];
}

export const parseDecoratorNodes = (cursor: TokensParser): DecoratorNode[] => {
  const decorators: DecoratorNode[] = [];

  for (let decorator; (decorator = parseMaybeDecoratorNode(cursor)); ) {
    decorators.push(decorator);
  }

  return decorators;
};

const parseMaybeDecoratorNode = (
  cursor: TokensParser,
): DecoratorNode | undefined => {
  const decoratorToken = cursor.maybeConsumePunctuation('@');
  if (!decoratorToken) return undefined;

  if (!decoratorToken.adjacent) {
    cursor.position -= 1;
    throw cursor.createError('decorator name');
  }

  const callee = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor);

  return {
    type: 'Decorator',
    callee,
    arguments: args,
  };
};
