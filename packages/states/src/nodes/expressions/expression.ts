import { IdentifierNode } from '../identifier';
import { LiteralNode } from '../literal';
import { BinaryExpressionNode } from './binary';
import { CallExpressionNode } from './call';
import { LogicalExpressionNode } from './logical';
import { MemberExpressionNode } from './member';
import { UnaryExpressionNode } from './unary';

export type ExpressionNode =
  | MemberExpressionNode
  | CallExpressionNode
  | BinaryExpressionNode
  | LogicalExpressionNode
  | UnaryExpressionNode
  | LiteralNode
  | IdentifierNode;
