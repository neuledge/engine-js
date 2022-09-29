import { TokensParser } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

export interface DecoratorNode extends AbstractNode<'Decorator'> {
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
  const start = cursor.start;

  const decoratorToken = cursor.maybeConsumePunctuation('@');
  if (!decoratorToken) return undefined;

  if (!decoratorToken.adjacent) {
    cursor.index -= 1;
    throw cursor.createError('decorator name');
  }

  const callee = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor);

  return {
    type: 'Decorator',
    start,
    end: cursor.end,
    callee,
    arguments: args,
  };
};
