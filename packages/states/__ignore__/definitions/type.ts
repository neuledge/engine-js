import { StateDefinition } from './state.js';
import { ScalarDefinition } from './scalar.js';
import { EitherDefinition } from './either.js';
import { TypeNode } from '@/nodes/type.js';
import { StatesContext } from './context.js';
import { ParsingError } from '@/parsing-error.js';

export type TypeDefinition =
  | ScalarTypeDefinition
  | StateTypeDefinition
  | EitherTypeDefinition;

export interface ScalarTypeDefinition {
  type: 'Scalar';
  scalar: ScalarDefinition;
}

export interface StateTypeDefinition {
  type: 'State';
  state: StateDefinition;
  list: boolean;
}

export interface EitherTypeDefinition {
  type: 'Either';
  either: EitherDefinition;
  list: boolean;
}

export const defineType = (
  ctx: StatesContext,
  node: TypeNode,
): TypeDefinition => {
  const { name } = node.identifier;

  if (node.type === 'TypeGenerator') {
    throw new ParsingError(
      node.identifier,
      `Can't find type generator named '${name}'`,
    );
  }

  const scalar = ctx.scalars[name];
  if (scalar) {
    if (node.list) {
      throw new ParsingError(
        node,
        `Can't store list of scalars, consider embeding the scalar in a list of states`,
      );
    }

    return defineScalarType(scalar);
  }

  const state = ctx.getStateRef(name);
  if (state) {
    return defineStateType(state as StateDefinition, node.list);
  }

  // TODO eithers

  throw new ParsingError(node.identifier, `Can't find type named '${name}'`);
};

const defineScalarType = (scalar: ScalarDefinition): ScalarTypeDefinition => ({
  type: 'Scalar',
  scalar,
});

const defineStateType = (
  state: StateDefinition,
  list: boolean,
): StateTypeDefinition => ({
  type: 'State',
  state,
  list,
});
