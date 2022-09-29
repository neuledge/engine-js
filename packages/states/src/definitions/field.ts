import { FieldReferenceNode, StateFieldNode } from '@/ast/index.js';
import { ParsingError } from '@/parsing-error.js';
import { StatesContext } from './context.js';
import { NamedDefinition } from './named.js';
import { TypeDefinition } from './type.js';

export interface FieldDefintion extends NamedDefinition {
  index: number;
  primaryKey?: boolean;
  nullable?: boolean;
  type: TypeDefinition;
}

export const defineField = (
  ctx: StatesContext,
  node: StateFieldNode,
): FieldDefintion => {
  if (node.type === 'FieldReference') {
    return defineReferenceField(ctx, node);
  }

  throw 1;
};

export const defineReferenceField = (
  ctx: StatesContext,
  node: FieldReferenceNode,
): FieldDefintion => {
  const states = ctx.states[node.state.identifier.name];
  if (!states?.length) {
    throw new ParsingError(
      node.state,
      `Can't find state '${node.state.identifier.name}'`,
    );
  }

  const version = node.state.version?.value ?? states.length - 1;
  const state = states[version - 1];
  if (!state) {
    throw new ParsingError(
      node.state,
      `Can't find state '${node.state.identifier.name}@${version}'`,
    );
  }

  const field = state.fields[node.key.name];
  if (!field) {
    throw new ParsingError(
      node.key,
      `Field '${node.key.name}' does not exists on state '${node.state.identifier.name}'`,
    );
  }

  throw 2;
};
