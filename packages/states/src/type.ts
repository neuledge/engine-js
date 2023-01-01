import { TypeExpressionNode, TypeNode } from '@neuledge/states-parser';
import { StatesContext } from './context';
import { NonNullableEntity, parseNonNullableEntity } from './entity';

export type Type = EntityExpression;

export interface EntityExpression {
  type: 'EntityExpression';
  node: TypeExpressionNode;
  entity: NonNullableEntity;
  list: boolean;
}

// export interface TypeGenerator {
//     type: 'TypeGenerator';
//     generator: Generator;
//     arguments: ...;
// }

export const parseType = (ctx: StatesContext, node: TypeNode): Type => {
  if (node.type === 'TypeGenerator') {
    throw new Error('Not implemented');
  }

  return parseEntityExpression(ctx, node);
};

const parseEntityExpression = (
  ctx: StatesContext,
  node: TypeExpressionNode,
): EntityExpression => ({
  type: 'EntityExpression',
  node,
  entity: parseNonNullableEntity(ctx, node.identifier),
  list: node.list,
});
