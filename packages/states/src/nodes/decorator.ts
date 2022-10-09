import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

export interface DecoratorNode extends AbstractNode<'Decorator'> {
  callee: IdentifierNode;
  arguments: ArgumentNode<LiteralNode>[];
}

export const parseDecoratorNodes = (cursor: Tokenizer): DecoratorNode[] => {
  const decorators: DecoratorNode[] = [];

  for (let decorator; (decorator = parseMaybeDecoratorNode(cursor)); ) {
    decorators.push(decorator);
  }

  return decorators;
};

const parseMaybeDecoratorNode = (
  cursor: Tokenizer,
): DecoratorNode | undefined => {
  const start = cursor.start;

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
    path: cursor.path,
    start,
    end: cursor.end,
    callee,
    arguments: args,
  };
};
