import { LiteralNode, LiteralValue } from '@neuledge/states-parser';

export interface Literal<T extends LiteralValue = LiteralValue> {
  type: 'Literal';
  node?: LiteralNode<T>;
  value: T;
}

export const parseLiteral = <T extends LiteralValue = LiteralValue>(
  node: LiteralNode<T>,
): Literal<T> & { node: LiteralNode<T> } => ({
  type: 'Literal',
  node,
  value: node.value,
});
