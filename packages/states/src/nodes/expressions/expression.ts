import { IdentifierNode } from '../identifier.js';
import { LiteralNode } from '../literal.js';
import { BinaryExpressionNode } from './binary.js';
import { CallExpressionNode } from './call.js';
import { LogicalExpressionNode } from './logical.js';
import { MemberExpressionNode } from './member.js';
import { UnaryExpressionNode } from './unary.js';

export type ExpressionNode =
  | MemberExpressionNode
  | CallExpressionNode
  | BinaryExpressionNode
  | LogicalExpressionNode
  | UnaryExpressionNode
  | LiteralNode
  | IdentifierNode;
