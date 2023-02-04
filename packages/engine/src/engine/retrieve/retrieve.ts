import { StoreDocument } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { NeuledgeError } from '@/error';
import { EntityList } from '@/list';
import { IncludeQueryOptions, Select, SelectQueryOptions } from '@/queries';
import { AlterReturnQueryOptions } from '@/queries/return';

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
    includeOne,
    includeMany,
  }: AlterReturnQueryOptions &
    SelectQueryOptions<S, P> &
    IncludeQueryOptions<S>,
): Promise<
  EntityList<ProjectedEntity<S, P>> | EntityList<Entity<S>> | void
> => {
  if (!returns) return;

  if (includeOne || includeMany) {
    // FIXME support include options

    throw new NeuledgeError(
      NeuledgeError.Code.NOT_IMPLEMENTED,
      'Include options are not supported yet',
    );
  }

  if (returns === 'old') {
    return Object.assign(
      entities.map((entity) => entity.oldEntity as Entity<S>),
      { nextOffset: entities.nextOffset },
    );
  }

  if (select == null) {
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
