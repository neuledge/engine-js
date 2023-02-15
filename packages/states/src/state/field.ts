import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { parseType, Type } from '@/type';
import { FieldNode, ParsingError } from '@neuledge/states-parser';
import { z } from 'zod';
import {
  StateSortingIndex,
  StateIndexNameRegex,
  StatePrimaryKey,
} from './state-index';

export type StateField = ScalarField | RelationField;

/**
 * A scalar field is a field that exists in the current state. Typically,
 * this is a column in a database table and it can contain a scalar value
 * (including arrays and objects).
 */
export interface ScalarField extends AbstractField {
  type: 'ScalarField';
  sortingIndex?: StateSortingIndex;
  primaryKey?: StatePrimaryKey;
}

/**
 * A relation field is a field that references another state but does not
 * exist in the current state. Typically, this is a foreign key.
 */
export interface RelationField extends AbstractField {
  type: 'RelationField';
  referenceField: ScalarField['name'];
}

interface AbstractField {
  node: FieldNode;
  name: string;
  nullable?: boolean;
  index: number;
  description?: string;
  deprecated?: boolean | string;
  as: Type;
}

export const parseStateField = (
  ctx: StatesContext,
  node: FieldNode,
  baseIndex: number,
): StateField => {
  const as = parseType(ctx, node.as);

  const base: AbstractField = {
    node,
    name: node.key.name,
    nullable: node.nullable,
    index: node.index.value + baseIndex,
    description: node.description?.value,
    as,
  };

  const field: StateField =
    as.entity.type === 'Scalar' || !as.list
      ? {
          type: 'ScalarField',
          ...base,
        }
      : {
          type: 'RelationField',
          ...base,
          referenceField: null as never,
        };

  applyDecorators(field, node.decorators, decorators);

  if (field.type === 'RelationField' && !field.referenceField) {
    throw new ParsingError(
      node,
      `Relation field '${field.name}' must have a '@reference()' field annotation`,
    );
  }

  return field;
};

const decorators: Decorators<StateField> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    (field, args) => {
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
      auto: z.literal('increment').optional(),
    }),
    (field, { direction, auto }) => {
      if (field.type !== 'ScalarField') {
        throw new ParsingError(
          field.node,
          `@id can only be applied to scalar fields`,
        );
      }

      if (field.primaryKey) {
        throw new ParsingError(
          field.node,
          `Duplicate @id on field '${field.name}'`,
        );
      }

      field.primaryKey = {
        name: field.name,
        fields: {
          [field.name]:
            direction == null || direction === 'asc' || direction === 1
              ? 'asc'
              : 'desc',
        },
        unique: true,
        auto,
      };
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
      name: z.string().regex(StateIndexNameRegex).optional(),
    }),
    (field, { direction, unique, name }) => {
      if (field.type !== 'ScalarField') {
        throw new ParsingError(
          field.node,
          `@index can only be applied to scalar fields`,
        );
      }

      if (field.sortingIndex) {
        throw new ParsingError(
          field.node,
          `Duplicate @index or @unique on field '${field.name}'`,
        );
      }

      field.sortingIndex = {
        name: name || field.name,
        fields: {
          [field.name]:
            direction == null || direction === 'asc' || direction === 1
              ? 'asc'
              : 'desc',
        },
        unique,
      };
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
      name: z.string().regex(StateIndexNameRegex).optional(),
    }),
    (field, { direction, name }) => {
      if (field.type !== 'ScalarField') {
        throw new ParsingError(
          field.node,
          `@unique can only be applied to scalar fields`,
        );
      }

      if (field.sortingIndex) {
        throw new ParsingError(
          field.node,
          `Duplicate @unique or @index on field '${field.name}'`,
        );
      }

      field.sortingIndex = {
        name: name || field.name,
        fields: {
          [field.name]:
            direction == null || direction === 'asc' || direction === 1
              ? 'asc'
              : 'desc',
        },
        unique: true,
      };
    },
  ),

  reference: createDecorator(
    z.object({
      field: z.string().regex(/^[_a-z]\w*$/i),
    }),
    (field, { field: referenceField }) => {
      if (field.type === 'RelationField' && field.referenceField) {
        throw new ParsingError(
          field.node,
          `Duplicate @reference on field '${field.name}'`,
        );
      }

      Object.assign(field, {
        type: 'RelationField',
        referenceField,
      });
    },
  ),
};
