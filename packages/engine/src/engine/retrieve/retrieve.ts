import { StoreDocument } from '@neuledge/store';
import { StateDefinition } from '@/definitions';
import { Entity, ProjectedEntity } from '@/entity';
import { NeuledgeError } from '@/error';
import { EntityList } from '@/list';
import {
  IncludeQueryOptions,
  RequireQueryOptions,
  Select,
  SelectQueryOptions,
} from '@/queries';

export type UpdatedEntity<S extends StateDefinition> = {
  entity: Entity<S>;
  document: StoreDocument;
};

export const retrieveEntities = async <
  S extends StateDefinition,
  P extends Select<S>,
>(
  entities: EntityList<UpdatedEntity<S>>,
  {
    select,
    includeOne,
    includeMany,
    requireOne,
  }: SelectQueryOptions<S, P> & IncludeQueryOptions<S> & RequireQueryOptions<S>,
): Promise<
  EntityList<ProjectedEntity<S, P>> | EntityList<Entity<S>> | void
> => {
  if (!select) return;

  if (includeOne || includeMany || requireOne) {
    // FIXME support include and require options

    throw new NeuledgeError(
      NeuledgeError.Code.NOT_IMPLEMENTED,
      'Include and require options are not supported yet',
    );
  }

  if (select === true) {
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
