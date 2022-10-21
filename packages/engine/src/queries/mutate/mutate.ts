import {
  State,
  StateActionArguments,
  StateActions,
} from '@/generated/index.js';

export class MutateQuery<
  S extends State,
  K extends StateActions<S>,
  A extends StateActionArguments<S, K>,
> {
  public readonly args: A[];

  constructor(
    public readonly states: S[],
    public readonly action: K,
    ...args: A[]
  ) {
    this.args = args;
  }

  where(x: any): any {}
  select(x?: any): any {}
}
