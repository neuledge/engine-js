import {
  DecoratorNode,
  FieldReferenceNode,
  StateFieldNode,
} from '@/nodes/index.js';
import { ParsingError } from '@/parsing-error.js';
import { StatesContext } from './context.js';
import { attachDeprecatedDecorator } from './decorators/index.js';
import { NamedDefinition } from './named.js';
import { defineType, TypeDefinition } from './type.js';

export interface FieldDefintion extends NamedDefinition {
  index: number;
  primaryKey?: boolean;
  nullable?: boolean;
  type: TypeDefinition;
}

export const defineField = (
  ctx: StatesContext,
  node: StateFieldNode,
): FieldDefintion | null => {
  if (node.type === 'FieldReference') {
    return defineReferenceField(ctx, node);
  }

  const def: FieldDefintion = {
    name: node.key.name,
    description: node.description?.value ?? null,
    deprecationReason: null,
    index: node.index.value,
    primaryKey: false,
    nullable: node.nullable,
    type: defineType(ctx, node.fieldType),
  };

  for (const decorator of node.decorators) {
    attachFieldDecoration(def, decorator);
  }

  return def;
};

const defineReferenceField = (
  ctx: StatesContext,
  node: FieldReferenceNode,
): FieldDefintion | null => {
  const stateName = node.state.name;

  const state = ctx.getStateRef(stateName);
  if (!state) {
    throw new ParsingError(node.state, `Can't find state '${stateName}'`);
  }
  if (!state.fields) {
    return null;
  }

  const field = state.fields[node.key.name] as FieldDefintion;

  if (!field) {
    throw new ParsingError(
      node.key,
      `Field '${node.key.name}' does not exists on state '${stateName}'`,
    );
  }

  if (!('type' in field)) {
    throw new Error(
      `Unexpected field reference for '${stateName}.${field.name}'`,
    );
  }

  if (node.substract) {
    throw new Error(
      `Unexpected field reference for '${stateName}.${field.name}'`,
    );
  }

  return { ...field, index: node.index.value };
};

const attachFieldDecoration = (
  def: FieldDefintion,
  decorator: DecoratorNode,
): void => {
  switch (decorator.callee.name) {
    case 'deprecated': {
      attachDeprecatedDecorator(def, decorator);
      break;
    }

    case 'id': {
      def.primaryKey = true;
      break;
    }

    default: {
      return;
    }
  }
};
