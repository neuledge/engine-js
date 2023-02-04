import { MutationDefinition, StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity, InitiatedEntity } from '@/entity';
import { NeuledgeError } from '@/error';
import { EntityList } from '@/list';
import { InitManyQueryOptions, InitOneQueryOptions, Select } from '@/queries';
import { chooseStatesCollection } from '../collection';
import { toDocument } from '../document';
import { NeuledgeEngine } from '../engine';
import { toEntityOrThrow } from '../entity';
import { retrieveEntities } from '../retrieve';

export const execInitMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: InitManyQueryOptions<S, S> | InitOneQueryOptions<S, S>,
): Promise<
  EntityList<Entity<S>> | EntityList<ProjectedEntity<S, Select<S>>> | void
> => {
  const metadata = await engine.metadata;
  const { collection } = chooseStatesCollection(metadata, options.states);

  const [state] = options.states;
  const fn = state[options.method] as MutationDefinition<S> | undefined;

  if (fn?.mutation !== 'create') {
    throw new NeuledgeError(
      NeuledgeError.Code.INVALID_MUTATION,
      `Mutation ${String(options.method)} is not an init mutation`,
    );
  }

  const newEntities: InitiatedEntity<S>[] = await Promise.all(
    options.args.map((args) => fn(args)),
  );

  const entities = newEntities.map(
    (entity): Entity<S> => ({
      ...(entity as InitiatedEntity<StateDefinition>),
      $version: 0,
    }),
  );

  const documents = entities.map((entity) =>
    toDocument(metadata, collection, entity),
  );

  const { insertedIds } = await engine.store.insert({
    collection,
    documents,
  });

  const updatedEntities = documents.map((oldDoc, i) => {
    const document = { ...oldDoc, ...insertedIds[i] };
    const entity = toEntityOrThrow(metadata, collection, document);

    return { entity, document, oldEntity: null };
  });

  return retrieveEntities(updatedEntities, options);
};

export const execInitOne = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: InitOneQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const res = await execInitMany(engine, options);
  return res && res[0];
};
