import { AbstractNode } from '../abstract';
import { ArgumentNode } from '../argument';
import { IdentifierNode } from '../identifier';
import { ExpressionNode } from './expression';

export interface CallExpressionNode extends AbstractNode<'CallExpression'> {
  callee: IdentifierNode;
  arguments: ArgumentNode<ExpressionNode>[];
}
