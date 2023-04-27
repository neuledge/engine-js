import { Type } from '@neuledge/states';
import { generateEntityScalar, generateEntityType } from './entity';

export const generateTypeScalar = (type: Type): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new ParsingError('Not implemented.');

    case 'EntityExpression': {
      return type.list
        ? `[${generateEntityScalar(type.entity)}] as const`
        : generateEntityScalar(type.entity);
    }

    default: {
      throw new TypeError(`Unexpected type: ${type.type}`);
    }
  }
};

export const generateTypeType = (type: Type): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new ParsingError('Not implemented.');

    case 'EntityExpression': {
      return type.list
        ? `${generateEntityType(type.entity)}[]`
        : generateEntityType(type.entity);
    }

    default: {
      throw new TypeError(`Unexpected type: ${type.type}`);
    }
  }
};
