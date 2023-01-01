import { Type } from '@neuledge/states';
import { generateEntityType } from './entity';

export const generateTypeType = (type: Type): string => {
  switch (type.type) {
    // case 'TypeGenerator':
    //   throw new Error('Not implemented.');

    case 'EntityExpression':
      return type.list
        ? `${generateEntityType(type.entity)}[]`
        : generateEntityType(type.entity);

    default:
      throw new TypeError(`Unexpected type: ${type.type}`);
  }
};
