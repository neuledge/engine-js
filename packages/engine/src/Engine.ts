// import { State } from '@neuledge/state';
// import { EntityId, Projection } from '@neuledge/entity';
import { EngineStore } from './Store.js';

export class NeuledgeEngine<Store extends EngineStore> {
  constructor(public readonly store: Store) {}

  // async findUnique<S extends State>(
  //   states: S[],
  //   filter: EntityId<S>,
  //   projection: Projection<S>,
  // ): Promise<void> {}
}
