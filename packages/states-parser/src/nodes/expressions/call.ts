import { TokenCursor } from '@/tokens';
import { AbstractNode } from '../abstract';
import { ArgumentNode, parseArgumentNodes } from '../argument';
import { IdentifierNode, parseIdentifierNode } from '../identifier';
import { ExpressionNode, parseExpressionNode } from './expression';

export interface CallExpressionNode extends AbstractNode<'CallExpression'> {
  callee: IdentifierNode;
  arguments: ArgumentNode<ExpressionNode>[];
}

export const parseCallExpressionNode = (
  cursor: TokenCursor,
): CallExpressionNode => {
  const start = cursor.start;

  const callee = parseIdentifierNode(cursor);
  const args = parseArgumentNodes(cursor, parseExpressionNode, true);

  return {
    type: 'CallExpression',
    path: cursor.path,
    start,
    end: cursor.end,
    callee,
    arguments: args,
  };
};
