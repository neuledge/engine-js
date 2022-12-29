import {
  ParsingError,
  TypeExpressionNode,
  TypeNode,
} from '@neuledge/states-parser';
import { StatesContext } from './context';
import { Entity } from './entity';

export type Type = EntityExpression;

export interface EntityExpression {
  type: 'EntityExpression';
  node: TypeExpressionNode;
  entity: Entity;
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
): EntityExpression => {
  const entity = ctx.entity(node.identifier.name);
  if (!entity) {
    throw new ParsingError(
      node.identifier,
      `Unknown entity '${node.identifier.name}'`,
    );
  }

  return {
    type: 'EntityExpression',
    node,
    entity,
    list: node.list,
  };
};
