import { StoreShapeType } from '@neuledge/store';
import {
  CustomScalar,
  EntityExpression,
  NonNullableEntity,
  Scalar,
} from '@neuledge/states';

export const generateEntityScalar = (entity: NonNullableEntity): string => {
  switch (entity.type) {
    case 'Either':
      return `[...${entity.name}]`;

    case 'State':
      return `[${entity.name}]`;

    case 'Scalar':
      return `$.scalars.${entity.name}`;

    default:
      // @ts-expect-error `entity` is never
      throw new TypeError(`Unexpected entity type: ${entity.type}`);
  }
};

export const generateEntityType = (entity: NonNullableEntity): string => {
  switch (entity.type) {
    case 'Either':
      return `$.Id<typeof ${entity.name}[number]>`;

    case 'State':
      return `$.Id<typeof ${entity.name}>`;

    case 'Scalar':
      return entity.node ? entity.name : `$.scalars.${entity.name}`;

    default:
      // @ts-expect-error `entity` is never
      throw new TypeError(`Unexpected entity type: ${entity.type}`);
  }
};

export const generateWhereEntityExpression = (
  { entity, list }: EntityExpression,
  nullable?: boolean,
): string => {
  switch (entity.type) {
    case 'Either': {
      if (list) {
        throw new Error('Where list of eithers is not supported.');
      }

      return `$.Where${nullable ? 'Nullable' : ''}State<typeof ${
        entity.name
      }[number]>`;
    }

    case 'State': {
      if (list) {
        throw new Error('Where list of states is not supported.');
      }

      return `$.Where${nullable ? 'Nullable' : ''}State<typeof ${entity.name}>`;
    }

    case 'Scalar':
      return generateWhereScalar(entity, nullable, list);

    default:
      // @ts-expect-error `entity` is never
      throw new TypeError(`Unexpected entity type: ${entity.type}`);
  }
};

const generateWhereScalar = (
  scalar: Scalar | CustomScalar,
  nullable: boolean | undefined,
  list: boolean,
): string => {
  const nullish = nullable ? 'Nullable' : '';
  const name = scalar.node ? scalar.name : `$.scalars.${scalar.name}`;
  const where = list ? 'Array' : WhereShapeTypeMap[scalar.shape.type];

  return `$.Where${nullish}${where}<${name}>`;
};

const WhereShapeTypeMap: Record<StoreShapeType, string> = {
  boolean: 'Boolean',
  'date-time': 'DateTime',
  number: 'Number',
  string: 'String',
  binary: 'Buffer',
  json: 'Unknown',
  enum: 'Enum',
};
