import { IdentifierNode } from './identifier.js';

export type FieldReferenceNode =
  | {
      type: 'FieldReference';
      state: IdentifierNode;
      identifier: IdentifierNode;
      index: number;
      substract?: false;
    }
  | {
      type: 'FieldReference';
      state: IdentifierNode;
      identifier: IdentifierNode;
      index?: undefined;
      substract: true;
    };
