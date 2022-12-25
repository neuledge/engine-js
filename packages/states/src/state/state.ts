import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { FieldNode, ParsingError, StateNode } from '@neuledge/states-parser';
import { z } from 'zod';
import { parseStateFields, StateField } from './field';
import { StateIndex, StatePrimaryKey } from './state-index';

export interface State {
  node: StateNode;
  name: string;
  description?: string;
  deprecated?: boolean | string;
  fields: Record<string, StateField>;
  primaryKey: StatePrimaryKey;
  indexes: StateIndex[];
}

export const parseState = (node: StateNode, fields: FieldNode[]): State => {
  const primaryKey: StatePrimaryKey = {
    fields: {},
    unique: true,
  };

  const state: State = {
    node,
    name: node.id.name,
    description: node.description?.value,
    fields: {},
    primaryKey,
    indexes: [primaryKey],
  };

  state.fields = parseStateFields(state, fields);

  applyDecorators(state, node.decorators, decorators);

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
    }),
    (state, { fields }, argsNodes) => {
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
    }),
    (state, { fields, unique }, argsNodes) => {
      const fieldsEntries = Array.isArray(fields)
        ? fields.map((field): [string, 'asc'] => [field, 'asc'])
        : Object.entries(fields);

      const index: StateIndex = {
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

      state.indexes.push(index);
    },
  ),
};
