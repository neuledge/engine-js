import { StoreDocument } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { NeuledgeError } from '@/error';
import { EntityList } from '@/list';
import {
  PopulateQueryOptions,
  ReturnQueryOptions,
  Select,
  SelectQueryOptions,
} from '@/queries';

export interface AlteredEntity<S extends StateDefinition> {
  oldEntity: Entity<S> | null;
  entity: Entity<S>;
  document: StoreDocument;
}

export const retrieveEntities = async <
  S extends StateDefinition,
  P extends Select<S>,
>(
  entities: EntityList<AlteredEntity<S>>,
  {
    returns,
    select,
    populateMany,
    populateOne,
  }: Partial<ReturnQueryOptions> &
    SelectQueryOptions<S, P> &
    PopulateQueryOptions<S>,
): Promise<
  EntityList<ProjectedEntity<S, P>> | EntityList<Entity<S>> | void
> => {
  if (!select) return;

  if (populateMany || populateOne) {
    // FIXME support populate options

    throw new NeuledgeError(
      NeuledgeError.Code.NOT_IMPLEMENTED,
      'Populate options are not supported yet',
    );
  }

  if (returns === 'old') {
    return Object.assign(
      entities.map((entity) => entity.oldEntity as Entity<S>),
      { nextOffset: entities.nextOffset },
    );
  }

  if (select == true) {
    return Object.assign(
      entities.map((entity) => entity.entity),
      { nextOffset: entities.nextOffset },
    );
  }

  return Object.assign(
    entities.map((entity) => projectEntity(entity.entity, select)),
    { nextOffset: entities.nextOffset },
  );
};

const projectEntity = <S extends StateDefinition, P extends Select<S>>(
  entity: Entity<S>,
  select: P,
): ProjectedEntity<S, P> => {
  const projectedEntity = {} as ProjectedEntity<S, P>;

  for (const [key, value] of Object.entries(select)) {
    if (!value) continue;

    projectedEntity[key as never] = entity[key] as never;
  }

  return projectedEntity;
};
