import { resolveDefer, State } from '@/generated/index.js';
import { Scalar } from '@neuledge/scalars';
import { MetadataEntityHash } from './entity.js';
import { generateHash } from './hash.js';

export interface MetadataState {
  key: string;
  hash: MetadataEntityHash;
  fields: Record<
    string,
    { type: Scalar['key'] | MetadataState[]; index: number; nullable: boolean }
  >;
  origin?: State;
}

export interface MetadataStateField {
  type: Scalar['key'] | MetadataState[];
  index: number;
  nullable: boolean;
}

export const toMetadataState = (state: State): MetadataState => {
  const fields: MetadataState['fields'] = {};

  const scalars = resolveDefer(state.$scalars);
  for (const key in scalars) {
    const { type, index, nullable } = scalars[key];

    fields[key] = {
      type: Array.isArray(type)
        ? type.map((item) => toMetadataState(item))
        : type.key,
      index,
      nullable: !!nullable,
    };
  }

  return {
    key: state.$key,
    hash: generateStateHash(fields),
    fields,
    origin: state,
  };
};

export const isMetadataStatesEquals = (
  a: MetadataState,
  b: MetadataState,
): boolean =>
  a.key === b.key &&
  a.hash.equals(b.hash) &&
  Object.entries(a.fields).every(([key, { type, index, nullable }]) => {
    const bf = b.fields[key];
    if (!bf) return false;

    const bt = bf.type;

    return (
      index === bf.index &&
      nullable === bf.nullable &&
      (typeof type === 'string'
        ? type === bt
        : type.length === bt.length &&
          typeof bt !== 'string' &&
          type.every((item, i) => isMetadataStatesEquals(item, bt[i])))
    );
  });

export const serializeMetadataState = (
  state: MetadataState,
): MetadataState => ({
  key: state.key,
  hash: state.hash,
  fields: Object.fromEntries(
    Object.entries(state.fields).map(([key, { type, index, nullable }]) => [
      key,
      {
        type:
          typeof type === 'string'
            ? type
            : type.map((item) => serializeMetadataState(item)),
        index,
        nullable,
      },
    ]),
  ),
});

const generateStateHash = (
  fields: MetadataState['fields'],
): MetadataEntityHash =>
  generateHash(
    Object.values(fields)
      .map(
        ({ type, index, nullable }): [number, string | string[], boolean] => [
          index,
          Array.isArray(type)
            ? type.map((item) => item.hash.toString('hex'))
            : type,
          nullable,
        ],
      )
      .sort((a, b) => a[0] - b[0]),
  );
