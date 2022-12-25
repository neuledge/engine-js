import { TypeExpressionNode, TypeNode } from '@neuledge/states';

export const generateTypeofType = (type: TypeNode): string => {
  switch (type.type) {
    case 'TypeGenerator':
      throw new Error('Not implemented.');

    case 'TypeExpression':
      return generateTypeExpression(type);

    default:
      // @ts-expect-error `type` is not a TypeNode
      throw new TypeError(`Unexpected type: ${type.type}`);
  }
};

const generateTypeExpression = (type: TypeExpressionNode): string => {
  const typeofOwnType = generateTypeofOwnType(type);

  return type.list ? `${typeofOwnType}[]` : typeofOwnType;
};

const generateTypeofOwnType = (type: TypeNode): string => {
  switch (type.identifier.name) {
    case 'String':
      return 'string';

    case 'Number':
      return 'number';

    case 'Boolean':
      return 'boolean';

    default:
      return type.identifier.name;
  }
};
