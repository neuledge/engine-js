export {
  State,
  type StateDefinitionId as Id,
  type StateDefinitionWhere as Where,
  type StateDefinitionWhereId as WhereId,
  type StateDefinitionWhereNumber as WhereNumber,
  type StateDefinitionWhereObject as WhereObject,
  type EitherDefintion as Either,
  createEitherDefintion as either,
  createMutation as createMutation,
} from './definitions';

export { type Entity as Entity, type MutatedEntity as Type } from '@/entity';

const DateConstructor = Date;

export { DateConstructor as Date };
