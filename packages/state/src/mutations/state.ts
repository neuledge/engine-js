import { StateFieldType } from '@/field.js';
import { State } from '../state/index.js';

export type StateMutations = {
  [Name: string]: StateMutation;
};

export interface StateMutation {
  arguments: StateMutationArguments;
  return: State | null;
}

type StateMutationArguments = {
  [Key: string]: StateMutationArgument;
};

interface StateMutationArgument {
  type: StateFieldType;
  nullable?: boolean;
}
