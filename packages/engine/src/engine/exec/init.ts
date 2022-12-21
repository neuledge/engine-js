import { MutationDefinition, StateDefinition } from '@/definitions';
import { Entity, MutatedEntity, ProjectedEntity } from '@/entity';
import { NeuledgeError, NeuledgeErrorCode } from '@/error';
import { EntityList } from '@/list';
import { InitManyQueryOptions, InitOneQueryOptions, Select } from '@/queries';
import { chooseStatesCollection } from '../collection';
import { toDocument } from '../document';
import { NeuledgeEngine } from '../engine';
import { projectEntities } from '../entity';

export const execInitMany = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: InitManyQueryOptions<S, S> | InitOneQueryOptions<S, S>,
): Promise<
  EntityList<Entity<S>> | EntityList<ProjectedEntity<S, Select<S>>> | void
> => {
  const metadata = await engine.metadata;
  const collection = chooseStatesCollection(metadata, options.states);

  const [state] = options.states;
  const fn = state[options.method] as MutationDefinition<S> | undefined;

  if (fn?.mutation !== 'create') {
    throw new NeuledgeError(
      NeuledgeErrorCode.INVALID_MUTATION,
      `Mutation ${String(options.method)} is not an init mutation`,
    );
  }

  const newEntities: MutatedEntity<S>[] = await Promise.all(
    options.args.map((args) => fn(args)),
  );

  const entities = newEntities.map(
    (entity): Entity<S> => ({
      ...(entity as MutatedEntity<StateDefinition>),
      $version: 0,
    }),
  );

  const documents = entities.map((entity) =>
    toDocument(metadata, collection, entity),
  );

  await engine.store.insert({
    collectionName: collection.name,
    documents,
  });

  const updatedEntities = entities.map((entity, i) => ({
    entity,
    document: documents[i],
  }));

  return projectEntities(updatedEntities, options.select);
};

export const execInitOne = async <S extends StateDefinition>(
  engine: NeuledgeEngine,
  options: InitOneQueryOptions<S, S>,
): Promise<Entity<S> | ProjectedEntity<S, Select<S>> | void> => {
  const res = await execInitMany(engine, options);
  return res && res[0];
};
