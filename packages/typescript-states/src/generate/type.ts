import { Entity, EntityExpression, Type } from '@neuledge/states';

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

export const isScalarType = (type: Type): boolean => !type.list;

export const generateScalarType = (type: Type): string => {
  let result;
  switch (type.entity.type) {
    case 'Either':
      result = `[...${type.entity.name}]`;
      break;

    case 'State':
      result = `[${type.entity.name}]`;
      break;

    case 'Scalar':
      result = type.entity.name;
      break;

    default:
      throw new TypeError(`Unexpected entity type: ${type.type}`);
  }

  if (type.list) {
    result = `[${result}]`;
  }

  return result;
};

export const generateWhereType = (type: Type): string =>
  // FIXME implement
  `$.WhereNumber<${generateTypeofType(type)}>`;

const generateEntityExpression = (type: EntityExpression): string => {
  const typeofOwnType = generateTypeofOwnType(type.entity);

  return type.list ? `${typeofOwnType}[]` : typeofOwnType;
};

const generateTypeofOwnType = (entity: Entity): string => {
  switch (entity.name) {
    default:
      return entity.name;
  }
};
