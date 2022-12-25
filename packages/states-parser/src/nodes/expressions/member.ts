import { TokenCursor } from '@/tokens';
import { AbstractNode } from '../abstract';
import { IdentifierNode, parseIdentifierNode } from '../identifier';
import {
  IdentifierExpressionNode,
  NullLiteralNode,
  parseIdentifierExpressionNode,
} from './identifier';

export interface MemberExpressionNode extends AbstractNode<'MemberExpression'> {
  object:
    | Exclude<IdentifierExpressionNode, NullLiteralNode>
    | MemberExpressionNode;
  property: IdentifierNode;
}

export const parseMemberExpressionNode = (
  cursor: TokenCursor,
): MemberExpressionNode => {
  const start = cursor.start;

  let object: IdentifierExpressionNode | MemberExpressionNode =
    parseIdentifierExpressionNode(cursor);
  if (object.type === 'NullLiteral') {
    throw cursor.createError(`Unexpected null literal`);
  }

  cursor.consumePunctuation('.');

  do {
    const property = parseIdentifierNode(cursor);

    object = {
      type: 'MemberExpression',
      path: cursor.path,
      start,
      end: cursor.end,
      object,
      property,
    };
  } while (cursor.maybeConsumePunctuation('.'));

  return object;
};
