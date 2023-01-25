import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { Mutation } from '@/mutation';
import { FieldNode, ParsingError, StateNode } from '@neuledge/states-parser';
import { z } from 'zod';
import { parseStateFields, StateField } from './field';
import {
  StateIndex,
  StateIndexNameRegex,
  StatePrimaryKey,
} from './state-index';

export interface State<N extends string = string> {
  type: 'State';
  node: StateNode;
  name: N;
  description?: string;
  deprecated?: boolean | string;
  fields: Record<string, StateField>;
  primaryKey: StatePrimaryKey;
  indexes: Record<string, StateIndex>;
  mutations: Record<string, Mutation>;
}

export const parseState = (
  ctx: StatesContext,
  node: StateNode,
  fields: FieldNode[],
  mutations: Record<string, Mutation>,
): State => {
  const state: State = {
    type: 'State',
    node,
    name: node.id.name,
    description: node.description?.value,
    fields: {},
    primaryKey: {
      name: '',
      fields: {},
      unique: true,
    },
    indexes: {},
    mutations,
  };

  state.fields = parseStateFields(ctx, state, fields);

  applyDecorators(state, node.decorators, decorators);
  applyPrimaryKey(state, node);

  return state;
};

const decorators: Decorators<State> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    (state, args) => {
      state.deprecated = args.reason || true;
    },
  ),

  id: createDecorator(
    z.object({
      fields: z.union([
        z.record(
          z.union([
            z.literal('asc'),
            z.literal('desc'),
            z.literal(1),
            z.literal(-1),
          ]),
        ),
        z.array(z.string()),
      ]),
      auto: z.literal('increment').optional(),
    }),
    (state, { fields, auto }, argsNodes) => {
      const fieldsEntries = Array.isArray(fields)
        ? fields.map((field): [string, 'asc'] => [field, 'asc'])
        : Object.entries(fields);

      for (const [key, direction] of fieldsEntries) {
        const field = state.fields[key];

        if (!field) {
          throw new ParsingError(
            argsNodes.fields.value,
            `Field ${key} does not exist`,
          );
        }

        state.primaryKey.fields[field.name] =
          direction === 1 || direction === 'asc' ? 'asc' : 'desc';
      }

      if (auto) {
        state.primaryKey.auto = auto;
      }
    },
  ),

  index: createDecorator(
    z.object({
      fields: z.union([
        z.record(
          z.union([
            z.literal('asc'),
            z.literal('desc'),
            z.literal(1),
            z.literal(-1),
          ]),
        ),
        z.array(z.string()),
      ]),
      unique: z.boolean().optional(),
      name: z.string().regex(StateIndexNameRegex).optional(),
    }),
    (state, { fields, unique, name }, argsNodes, node) => {
      const fieldsEntries = Array.isArray(fields)
        ? fields.map((field): [string, 'asc'] => [field, 'asc'])
        : Object.entries(fields);

      const index: StateIndex = {
        name: name || fieldsEntries.map(([key]) => key).join('_'),
        fields: {},
        unique,
      };

      for (const [key, direction] of fieldsEntries) {
        const field = state.fields[key];

        if (!field) {
          throw new ParsingError(
            argsNodes.fields.value,
            `Field ${key} does not exist`,
          );
        }

        index.fields[field.name] =
          direction === 1 || direction === 'asc' ? 'asc' : 'desc';
      }

      if (state.indexes[index.name]) {
        throw new ParsingError(node, `Duplicate index name: ${index.name}`);
      }

      state.indexes[index.name] = index;

      if (index.name) {
        state.indexes[index.name] = index;
      }
    },
  ),
};

const applyPrimaryKey = (state: State, node: StateNode) => {
  const { primaryKey, indexes } = state;

  const primaryKeyName = Object.keys(primaryKey.fields).join('_');
  if (!primaryKeyName) {
    throw new ParsingError(
      node.id,
      'State must have at least one primary key field',
    );
  }

  let i = 0;
  primaryKey.name = primaryKeyName;

  while (indexes[primaryKey.name]) {
    primaryKey.name = `${primaryKeyName}_${++i}`;
  }

  indexes[primaryKey.name] = primaryKey;
};
