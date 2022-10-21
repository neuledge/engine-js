import { State } from '@/generated/index.js';

export class MutateOneQuery<S extends State> {
  constructor(public readonly states: S[], action: string) {}
}
