import {
  resolveDefer,
  StateDefinition,
  StateName,
  StateDefintionScalar,
} from '@/definitions';
import { NeuledgeError, NeuledgeErrorCode } from '@/index';
import { getScalarFields, MetadataStateField } from './field';
import {
  generateStateHash,
  MetadataGhostState,
  MetadataGhostStateRelation,
} from './ghost';

const METADATA_HASH_DEFAULT_FIELD = '__h';
const METADATA_VERSION_DEFAULT_FIELD = '__v';

export type MetadataStateContext = Partial<Record<StateName, MetadataState>>;

export interface MetadataStateReservedNames {
  hash: string;
  version: string;
}

export interface MetadataStateRelation extends MetadataGhostStateRelation {
  states: MetadataState[];
  path: string;
}

export class MetadataState extends MetadataGhostState {
  fields: MetadataStateField[];
  instance: StateDefinition;
  reservedNames: MetadataStateReservedNames;
  relations: MetadataStateRelation[];

  private constructor(ctx: MetadataStateContext, state: StateDefinition) {
    super();
    ctx[state.$name] = this;

    this.collectionName = state.$name;
    this.name = state.$name;
    this.hash = null as never;
    this.fields = [];
    this.instance = state;
    this.reservedNames = {
      hash: METADATA_HASH_DEFAULT_FIELD,
      version: METADATA_VERSION_DEFAULT_FIELD,
    };
    this.relations = [];

    const scalars = Object.entries(resolveDefer(state.$scalars));

    for (const [key, def] of scalars) {
      const fields = getScalarFields(key, key, def);

      for (const field of fields) {
        if (
          field.name === this.reservedNames.hash ||
          field.name === this.reservedNames.version
        ) {
          throw new NeuledgeError(
            NeuledgeErrorCode.RESERVED_FIELD_NAME,
            `State "${this.name}" has a scalar field named "${field.name}" which is reserved for internal use.`,
          );
        }
      }

      this.fields.push(...fields);
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
