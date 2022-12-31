import {
  CustomScalar,
  Entity,
  EntityExpression,
  Scalar,
  Type,
} from '@neuledge/states';

export const generateTypeofType = (type: Type): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new Error('Not implemented.');

    case 'EntityExpression':
      return generateEntityExpression(type);

    default:
      throw new TypeError(`Unexpected type: ${type.type}`);
  }
};

export type ScalarType = Type & { list?: false };

export const isScalarType = (type: Type): type is ScalarType => !type.list;

export const generateScalarType = (type: ScalarType): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new Error('Not implemented.');

    case 'EntityExpression':
      return generateEntityScalarType(type.entity);

    default:
      throw new TypeError(`Unexpected type: ${type.type}`);
  }
};

export const generateWhereType = (type: Type, nullable?: boolean): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new Error('Not implemented.');

    case 'EntityExpression':
      return generateWhereEntity(type.entity, nullable);

    default:
      throw new TypeError(`Unexpected type: ${type.type}`);
  }
};

const generateEntityExpression = (type: EntityExpression): string =>
  type.list ? `${type.entity.name}[]` : type.entity.name;

const generateEntityScalarType = (entity: Entity): string => {
  switch (entity.type) {
    case 'Either':
      return `[...${entity.name}]`;

    case 'State':
      return `[${entity.name}]`;

    case 'Scalar':
    case 'Void':
      return entity.name;

    default:
      // @ts-expect-error `entity` is never
      throw new TypeError(`Unexpected entity type: ${entity.type}`);
  }
};

const generateWhereEntity = (entity: Entity, nullable?: boolean): string => {
  switch (entity.type) {
    case 'Either':
      return `$.Where${nullable ? 'Nullable' : ''}State<typeof ${
        entity.name
      }[number]>`;

    case 'State':
      return `$.Where${nullable ? 'Nullable' : ''}State<typeof ${entity.name}>`;

    case 'Scalar':
      return generateWhereScalar(entity, nullable);

    case 'Void':
      return 'never';

    default:
      // @ts-expect-error `entity` is never
      throw new TypeError(`Unexpected entity type: ${entity.type}`);
  }
};

const generateWhereScalar = (
  scalar: Scalar | CustomScalar,
  nullable?: boolean,
): string => {
  if (scalar.node) {
    throw new Error('Where non built-in scalar is not implemented.');
  }

  switch (scalar.name) {
    case 'Boolean':
    case 'DateTime':
    case 'Number':
    case 'String':
      return `$.Where${nullable ? 'Nullable' : ''}${scalar.name}<${
        scalar.name
      }>`;

    default:
      throw new Error(`Unsupported scalar type: ${scalar.name}`);
  }
};
