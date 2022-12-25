import { TokenCursor } from '@/tokens';
import { AbstractNode } from '../abstract';
import { IdentifierNode, parseIdentifierNode } from '../identifier';

export type IdentifierExpressionNode =
  | ThisExpressionNode
  | NullLiteralNode
  | IdentifierNode;

export interface ThisExpressionNode extends AbstractNode<'ThisExpression'> {
  name: 'this';
}

export interface NullLiteralNode extends AbstractNode<'NullLiteral'> {
  value: null;
}

export const parseIdentifierExpressionNode = (
  cursor: TokenCursor,
): IdentifierExpressionNode => {
  const start = cursor.start;
  const value = cursor.pickKeyword('this', 'null')?.value;

  switch (value) {
    case 'this': {
      cursor.consumeKeyword('this');

      return {
        type: 'ThisExpression',
        path: cursor.path,
        start,
        end: cursor.end,
        name: 'this',
      };
    }

    case 'null': {
      cursor.consumeKeyword('null');

      return {
        type: 'NullLiteral',
        path: cursor.path,
        start,
        end: cursor.end,
        value: null,
      };
    }

    default: {
      return parseIdentifierNode(cursor);
    }
  }
};
