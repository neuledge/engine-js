import { StoreScalarValue } from '@neuledge/store';

export interface QueryHelpers {
  encodeIdentifier(identifier: string): string;
  encodeLiteral(literal: StoreScalarValue): string;
}
