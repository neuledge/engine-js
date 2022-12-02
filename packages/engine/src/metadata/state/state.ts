import {
  resolveDefer,
  StateDefinition,
  StateDefinitionName,
  StateDefintionScalar,
} from '@/definitions/index.js';
import { getScalarFields, MetadataStateField } from './field.js';
import {
  generateStateHash,
  MetadataGhostState,
  MetadataGhostStateRelation,
} from './ghost.js';

export type MetadataStateContext = Partial<
  Record<StateDefinitionName, MetadataState>
>;

export interface MetadataStateRelation extends MetadataGhostStateRelation {
  states: MetadataState[];
  path: string;
}

export class MetadataState extends MetadataGhostState {
  fields!: MetadataStateField[];
  instance!: StateDefinition;
  relations!: MetadataStateRelation[];

  private constructor(ctx: MetadataStateContext, state: StateDefinition) {
    super();
    ctx[state.$name] = this;

    this.collectionName = state.$name;
    this.name = state.$name;
    this.hash = null as never;
    this.fields = [];
    this.instance = state;
    this.relations = [];

    const scalars = Object.entries(resolveDefer(state.$scalars));

    for (const [key, def] of scalars) {
      this.fields.push(...getScalarFields(key, key, def));
    }

    for (const [key, def] of scalars) {
      this.relations.push(...getScalarRelations(ctx, key, def));
    }

    this.hash = generateStateHash(this);
  }

  static fromDefinition = (
    ctx: MetadataStateContext,
    state: StateDefinition,
  ): MetadataState => {
    let ref = ctx[state.$name];

    if (!ref) {
      ref = ctx[state.$name] = new MetadataState(ctx, state);
    }

    return ref;
  };
}

const getScalarRelations = (
  ctx: MetadataStateContext,
  key: string,
  def: StateDefintionScalar,
): MetadataStateRelation[] =>
  Array.isArray(def.type)
    ? [
        {
          name: key,
          states: def.type.map((state) =>
            MetadataState.fromDefinition(ctx, state),
          ),
          path: key,
          index: def.index,
        },
      ]
    : [];
