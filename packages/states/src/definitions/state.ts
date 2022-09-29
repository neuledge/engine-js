import { StateNode } from '@/ast/index.js';
import { ParsingError } from '@/parsing-error.js';
import { StatesContext } from './context.js';
import { defineField, FieldDefintion } from './field.js';
import { NamedDefinition } from './named.js';

export interface StateDefinition extends NamedDefinition {
  version: number;
  fields: Record<string, FieldDefintion>;
  indexes?: StateIndexDefinition[];
}

export interface StateIndexDefinition {
  // type: never;
  unique?: boolean;
  fields: FieldDefintion[];
}

export const defineState = (
  ctx: StatesContext,
  node: StateNode,
): StateDefinition => {
  const name = node.id.identifier.name;
  const version = node.id.version?.value ?? 0;

  if (ctx.states[name] != null && ctx.states[name][version - 1] != null) {
    throw new ParsingError(
      node.id,
      `Cannot redeclare state '${name}@${version}'`,
    );
  }

  const def: StateDefinition = {
    name,
    version,
    description: node.description?.value,
    deprecationReason: null,
    fields: {},
  };

  for (const item of node.fields) {
    if (item.type === 'FieldReference' && item.substract) continue;

    const { name } = item.key;
    if (def.fields[name]) {
      throw new ParsingError(item.key, `Cannot redeclare field '${name}'`);
    }

    def.fields[name] = { index: 0, name, type: {} as never };
  }

  if (!ctx.states[name]) ctx.states[name] = [];
  ctx.states[name][version - 1] = def;

  try {
    for (const item of node.fields) {
      const field = defineField(ctx, item);

      def.fields[field.name] = field;
    }
  } catch (error) {
    delete ctx.states[name];
    throw error;
  }

  return def;
};
