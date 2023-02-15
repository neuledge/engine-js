import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { Mutation } from '@/mutation';
import { ParsingError, StateNode } from '@neuledge/states-parser';
import { z } from 'zod';
import { StateField } from './field';
import {
  StateSortingIndex,
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
  indexes: Record<string, StateSortingIndex>;
  mutations: Record<string, Mutation>;
  baseIndex: number;
}

export const parseState = (
  node: StateNode,
  fields: State['fields'],
  mutations: State['mutations'],
  baseIndex: State['baseIndex'],
): State => {
  const state: State = {
    type: 'State',
    node,
    name: node.id.name,
    description: node.description?.value,
    fields,
    primaryKey: {
      name: '',
      fields: {},
      unique: true,
    },
    indexes: {},
    mutations,
    baseIndex,
  };

  for (const field of Object.values(fields)) {
    if (field.type !== 'ScalarField') continue;

    const { sortingIndex, primaryKey } = field;

    if (sortingIndex) {
      if (state.indexes[sortingIndex.name]) {
        throw new ParsingError(
          field.node,
          `Index '${sortingIndex.name}' already exists`,
        );
      }

      state.indexes[sortingIndex.name] = sortingIndex;
    }

    if (primaryKey) {
      Object.assign(state.primaryKey.fields, primaryKey.fields);

      if (primaryKey.auto) {
        state.primaryKey.auto = primaryKey.auto;
      }
    }
  }

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

      const index: StateSortingIndex = {
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
  const { primaryKey, indexes, fields } = state;

  const primaryKeys = Object.keys(primaryKey.fields);
  if (!primaryKeys.length) {
    throw new ParsingError(
      node.id,
      'State must have at least one primary key field',
    );
  }

  if (primaryKey.auto && primaryKeys.length > 1) {
    throw new ParsingError(
      node.id,
      'State with auto-incrementing primary key can only have one field',
    );
  }

  for (const key of primaryKeys) {
    const field = fields[key];

    if (field.nullable) {
      throw new ParsingError(
        field.node,
        'Primary key field cannot be nullable',
      );
    }
  }

  const primaryKeyName = primaryKeys.join('_');
  primaryKey.name = primaryKeyName;

  let i = 0;
  while (indexes[primaryKey.name]) {
    primaryKey.name = `${primaryKeyName}_${++i}`;
  }

  indexes[primaryKey.name] = primaryKey;
};
