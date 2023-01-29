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
  StateSnapshot,
  StateRelationSnapshot,
} from './snapshot';

const METADATA_HASH_DEFAULT_FIELD = '__h';
const METADATA_VERSION_DEFAULT_FIELD = '__v';

export type MetadataStateContext = Partial<Record<StateName, MetadataState>>;

export interface MetadataStateReservedNames {
  hash: string;
  version: string;
}

export interface MetadataStateRelation extends StateRelationSnapshot {
  states: MetadataState[];
  path: string;
}

export class MetadataState extends StateSnapshot {
  fields: MetadataStateField[];
  instance: StateDefinition;
  reservedNames: MetadataStateReservedNames;
  relations: MetadataStateRelation[];
  transforms: MetadataState[];

  static fromDefinition = (
    ctx: MetadataStateContext,
    state: StateDefinition,
    collectionName?: string,
  ): MetadataState => {
    let ref = ctx[state.$name];

    if (!ref) {
      // the constructor will add to context and handle circular references
      ref = new MetadataState(ctx, state);
    }

    if (collectionName) {
      ref.collectionName = collectionName;
    }

    return ref;
  };

  private constructor(ctx: MetadataStateContext, state: StateDefinition) {
    super();

    // add to context to handle circular references
    ctx[state.$name] = this;

    // init all properties before handling circular references
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
    this.transforms = [];

    const scalars = Object.entries(resolveDefer(state.$scalars));
    const transforms = resolveDefer(state.$transforms, []);

    // assing fields
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

    // assign relations
    for (const [key, def] of scalars) {
      this.relations.push(...getScalarRelations(ctx, key, def));
    }

    // assign transforms
    for (const def of transforms) {
      this.transforms.push(MetadataState.fromDefinition(ctx, def));
    }

    // generate hash after all properties are finalized
    this.hash = generateStateHash(this);
  }
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
