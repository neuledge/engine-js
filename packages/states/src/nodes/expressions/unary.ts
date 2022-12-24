import { Tokenizer } from '@/tokenizer';
import { AbstractNode } from '../abstract';
import { ExpressionNode, parseExpressionNode } from './expression';

const UnaryExpressionNodeOperators = {
  '!': 1,
  '-': 1,
  '+': 1,
  '~': 1,
} as const;

export interface UnaryExpressionNode extends AbstractNode<'UnaryExpression'> {
  operator: keyof typeof UnaryExpressionNodeOperators;
  argument: ExpressionNode;
}

const UnaryExpressionNodeOperatorsArray = Object.keys(
  UnaryExpressionNodeOperators,
) as (keyof typeof UnaryExpressionNodeOperators)[];

export const isUnaryExpressionNodeOperator = (
  operator: string,
): operator is keyof typeof UnaryExpressionNodeOperators =>
  operator in UnaryExpressionNodeOperators;

export const parseUnaryExpressionNode = (
  cursor: Tokenizer,
): UnaryExpressionNode => {
  const start = cursor.start;

  const operator = cursor.consumePunctuation(
    ...UnaryExpressionNodeOperatorsArray,
  ).value;
  const argument = parseExpressionNode(cursor);

  return {
    type: 'UnaryExpression',
    path: cursor.path,
    start,
    end: cursor.end,
    operator,
    argument,
  };
};
