import { StoreField, StoreScalarValue } from '@neuledge/store';

export interface QueryHelpers {
  encodeIdentifier(identifier: string): string;
  encodeLiteral(literal: StoreScalarValue, field: StoreField): string;
}
