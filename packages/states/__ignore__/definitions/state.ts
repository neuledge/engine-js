import { DecoratorNode, StateNode } from '@/nodes/index.js';
import { ParsingError } from '@/parsing-error.js';
import { StatesContext } from './context.js';
import { attachDeprecatedDecorator } from './decorators/index.js';
import { defineField, FieldDefintion } from './field.js';
import { NamedDefinition } from './named.js';

export interface StateDefinition extends NamedDefinition {
  version: number;
  fields: Record<string, FieldDefintion>;
  indexes?: StateIndexDefinition[];
}

export type StateDefinitionRef = Pick<StateDefinition, 'name' | 'version'> & {
  fields?: undefined;
};

export interface StateIndexDefinition {
  // type: never;
  unique?: boolean;
  fields: FieldDefintion[];
}

export const defineStateRef = (node: StateNode): StateDefinitionRef => {
  const { identifier, version } = node.id;

  const fieldNames: Record<string, true> = {};
  const fieldIndexes: string[] = [];

  for (const item of node.fields) {
    if (!item.index) continue;

    const { name } = item.key;
    if (fieldNames[name]) {
      throw new ParsingError(item.key, `Cannot redeclare field '${name}'`);
    }

    const { value: index } = item.index;
    if (fieldIndexes[index]) {
      throw new ParsingError(
        item.index,
        `Cannot reuse index '${index}' for field name '${name}',` +
          ` index already in use for field '${fieldIndexes[index]}'`,
      );
    }

    fieldNames[name] = true;
    fieldIndexes[index] = name;
  }

  return {
    name: identifier.name,
    version: version?.value ?? 0,
  };
};

export const defineState = (
  ctx: StatesContext,
  target: StateDefinitionRef | StateDefinition,
  node: StateNode,
): StateDefinition | null => {
  const name = node.id.identifier.name;
  const version = node.id.version?.value ?? 0;

  const fields = defineStateFields(ctx, node);
  if (!fields) {
    return null;
  }

  const def: StateDefinition = Object.assign(target, {
    name,
    version,
    description: node.description?.value ?? null,
    deprecationReason: null,
    fields,
  });

  for (const decorator of node.decorators) {
    attachStateDecorator(def, decorator);
  }

  return def;
};

const defineStateFields = (
  ctx: StatesContext,
  node: StateNode,
): StateDefinition['fields'] | null => {
  const fields: StateDefinition['fields'] = {};

  if (node.from) {
    const extendsFields = getExtendsFields(ctx, node.from);
    if (!extendsFields) return null;

    Object.assign(fields, extendsFields);
  }

  for (const item of node.fields) {
    const { name } = item.key;

    if (item.index == null && item.substract === true) {
      if (!fields[name]) {
        throw new ParsingError(
          item.key,
          `Cannot substract field '${name}', field '${name}' doest not exists on state ${node.id.identifier.name}@${node.id.version?.value}`,
        );
      }

      delete fields[name];
      continue;
    }

    // FIXME field index conflict

    const field = defineField(ctx, item);
    if (!field) return null;

    fields[name] = field;
  }

  return fields;
};

const attachStateDecorator = (
  def: StateDefinition,
  decorator: DecoratorNode,
): void => {
  switch (decorator.callee.name) {
    case 'deprecated': {
      attachDeprecatedDecorator(def, decorator);
      break;
    }

    case 'index': {
      // TODO support index decorator
      break;
    }

    default: {
      return;
    }
  }
};

const getExtendsFields = (
  ctx: StatesContext,
  ext: NonNullable<StateNode['from']>,
): StateDefinition['fields'] | undefined => {
  const { identifier, version } = ext;

  const extendedState = ctx.getStateRef(identifier.name, version?.value);

  if (!extendedState) {
    throw new ParsingError(
      ext,
      `Cannot find state '${identifier.name}${
        version ? `@${version?.value}` : ''
      }'`,
    );
  }

  return extendedState.fields;
};
