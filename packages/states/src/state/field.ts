import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { NonNullableEntity, parseNonNullableEntity } from '@/entity';
import { parseType, Type } from '@/type';
import { FieldNode } from '@neuledge/states-parser';
import { z } from 'zod';
import { State } from './state';

export type StateField = ScalarField | RelationField;

export interface ScalarField {
  type: 'ScalarField';
  node: FieldNode;
  name: string;
  nullable?: boolean;
  index: number;
  description?: string;
  deprecated?: boolean | string;
  entity: NonNullableEntity;
}

export interface RelationField {
  type: 'RelationField';
  node: FieldNode;
  name: string;
  nullable?: boolean;
  index: number;
  description?: string;
  deprecated?: boolean | string;
  as: Type;
}

export const parseStateFields = (
  ctx: StatesContext,
  state: State,
  nodes: FieldNode[],
): Record<string, StateField> =>
  Object.fromEntries(
    nodes.map((node) => [node.key.name, parseStateField(ctx, state, node)]),
  );

const parseStateField = (
  ctx: StatesContext,
  state: State,
  node: FieldNode,
): StateField => {
  const field: StateField =
    node.as.type !== 'TypeExpression' || !node.as.list
      ? {
          type: 'ScalarField',
          node,
          name: node.key.name,
          nullable: node.nullable,
          index: node.index.value,
          description: node.description?.value,
          entity: parseNonNullableEntity(ctx, node.as.identifier),
        }
      : {
          type: 'RelationField',
          node,
          name: node.key.name,
          nullable: node.nullable,
          index: node.index.value,
          description: node.description?.value,
          as: parseType(ctx, node.as),
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
