import { AbstractNode } from '../abstract.js';
import { ArgumentNode } from '../argument.js';
import { IdentifierNode } from '../identifier.js';
import { ExpressionNode } from './expression.js';

export interface CallExpressionNode extends AbstractNode<'CallExpression'> {
  callee: IdentifierNode;
  arguments: ArgumentNode<ExpressionNode>[];
}
