import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { FieldNode } from '@neuledge/states-parser';
import { z } from 'zod';
import { State } from './state';

export interface StateField {
  node: FieldNode;
  name: string;
  nullable?: boolean;
  index: number;
  description?: string;
  deprecated?: boolean | string;
}

export const parseStateFields = (
  state: State,
  nodes: FieldNode[],
): Record<string, StateField> =>
  Object.fromEntries(
    nodes.map((node) => [node.key.name, parseStateField(state, node)]),
  );

const parseStateField = (state: State, node: FieldNode): StateField => {
  const field: StateField = {
    node,
    name: node.key.name,
    nullable: node.nullable,
    index: node.index.value,
    description: node.description?.value,
  };

  applyDecorators({ state, field }, node.decorators, decorators);

  return field;
};

const decorators: Decorators<{ state: State; field: StateField }> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    ({ field }, args) => {
      field.deprecated = args.reason || true;
    },
  ),

  id: createDecorator(
    z.object({
      direction: z
        .union([
          z.literal('asc'),
          z.literal('desc'),
          z.literal(1),
          z.literal(-1),
        ])
        .optional(),
    }),
    ({ state, field }, { direction }) => {
      state.primaryKey.fields[field.name] =
        direction == null || direction === 'asc' || direction === 1
          ? 'asc'
          : 'desc';
    },
  ),

  index: createDecorator(
    z.object({
      direction: z
        .union([
          z.literal('asc'),
          z.literal('desc'),
          z.literal(1),
          z.literal(-1),
        ])
        .optional(),
      unique: z.boolean().optional(),
    }),
    ({ state, field }, { direction, unique }) => {
      state.indexes.push({
        fields: {
          [field.name]:
            direction == null || direction === 'asc' || direction === 1
              ? 'asc'
              : 'desc',
        },
        unique,
      });
    },
  ),

  unique: createDecorator(
    z.object({
      direction: z
        .union([
          z.literal('asc'),
          z.literal('desc'),
          z.literal(1),
          z.literal(-1),
        ])
        .optional(),
    }),
    ({ state, field }, { direction }) => {
      state.indexes.push({
        fields: {
          [field.name]:
            direction == null || direction === 'asc' || direction === 1
              ? 'asc'
              : 'desc',
        },
        unique: true,
      });
    },
  ),
};
