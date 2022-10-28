import { resolveDefer, State } from '@/generated/index.js';
import { Scalar } from '@neuledge/scalars';
import { MetadataEntityHash } from './entity.js';
import { generateHash } from './hash.js';

export interface MetadataState {
  key: string;
  hash: MetadataEntityHash;
  fields: Record<
    string,
    { type: Scalar['key'] | MetadataState[]; nullable: boolean }
  >;
  origin?: State;
}

export const toMetadataState = (state: State): MetadataState => {
  const fields: MetadataState['fields'] = {};

  const scalars = resolveDefer(state.$scalars);
  for (const key in scalars) {
    const { type, nullable } = scalars[key];

    fields[key] = {
      type: Array.isArray(type)
        ? type.map((item) => toMetadataState(item))
        : type.key,
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

export const serializeMetadataState = (
  state: MetadataState,
): MetadataState => ({
  key: state.key,
  hash: state.hash,
  fields: Object.fromEntries(
    Object.entries(state.fields).map(([key, { type, nullable }]) => [
      key,
      {
        type:
          typeof type === 'string'
            ? type
            : type.map((item) => serializeMetadataState(item)),
        nullable,
      },
    ]),
  ),
});

const generateStateHash = (
  fields: MetadataState['fields'],
): MetadataEntityHash =>
  generateHash(
    Object.entries(fields)
      .map(
        ([key, { type, nullable }]): [string, string | string[], boolean] => [
          key,
          Array.isArray(type) ? type.map((item) => item.hash) : type,
          !!nullable,
        ],
      )
      .sort((a, b) => a[0].localeCompare(b[0])),
  );
