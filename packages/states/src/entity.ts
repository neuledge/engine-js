import { IdentifierNode, ParsingError } from '@neuledge/states-parser';
import { Either } from './either';
import { StatesContext } from './index';
import { CustomScalar, Scalar } from './scalar';
import { State } from './state';
import { Void } from './void';

export type Entity<N extends string = string> =
  | NonNullableEntity<N>
  | (typeof Void['name'] extends N ? typeof Void : never);

export type NonNullableEntity<N extends string = string> =
  | Either<N>
  | State<N>
  | (Scalar & { name: N })
  | CustomScalar<N>;

export const parseEntity = (
  ctx: StatesContext,
  node: IdentifierNode,
): Entity => {
  const entity = ctx.entity(node.name);

  if (!entity) {
    throw new ParsingError(node, `Unknown entity name '${node.name}'`);
  }

  return entity;
};

export const parseNonNullableEntity = (
  ctx: StatesContext,
  node: IdentifierNode,
): NonNullableEntity => {
  const entity = ctx.entity(node.name);

  if (!entity) {
    throw new ParsingError(node, `Unknown entity name '${node.name}'`);
  }
  if (entity.type === 'Void') {
    throw new ParsingError(node, `Void entity is nullable`);
  }

  return entity;
};
