import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { LiteralNode, parseLiteralNode } from './literal';

export interface DecoratorNode extends AbstractNode<'Decorator'> {
  callee: IdentifierNode;
  arguments: ArgumentNode<LiteralNode>[];
}

export const parseDecoratorNodes = (cursor: TokenCursor): DecoratorNode[] => {
  const decorators: DecoratorNode[] = [];

  for (let decorator; (decorator = parseMaybeDecoratorNode(cursor)); ) {
    decorators.push(decorator);
  }

  return decorators;
};

const parseMaybeDecoratorNode = (
  cursor: TokenCursor,
): DecoratorNode | undefined => {
  const start = cursor.start;
  const path = cursor.path;

  const decoratorToken = cursor.maybeConsumePunctuation('@');
  if (!decoratorToken) return undefined;

  if (!decoratorToken.adjacent) {
    cursor.index -= 1;
    throw cursor.createError('decorator name');
  }

  const callee = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor, parseLiteralNode);

  return {
    type: 'Decorator',
    path,
    start,
    end: cursor.end,
    callee,
    arguments: args,
  };
};
