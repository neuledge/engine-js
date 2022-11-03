import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { Metadata } from '@/metadata/index.js';
import { QueryOptions, QueryType } from '@/queries/index.js';
import { Store, StoreDocument, StoreList } from '@/store/index.js';

const DEFAULT_QUERY_LIMIT = 201;

type ExecFn<T extends QueryType, I extends State, O extends State> = (
  this: QueryOptions<T, I, O>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export class EngineExec {
  constructor(
    private readonly store: Store,
    private readonly metadata: Promise<Metadata>,
  ) {}

  // queries

  findMany<I extends State, O extends State>(): ExecFn<'FindMany', I, O> {
    return this.exec(async (metadata, options) =>
      // FIXME select, where, filter, includeFirst, requireFirst, includeMany, default limit
      this.toEntityList(
        await this.store.find({
          // FIXME collection name array
          collectionName: metadata.getCollectionNames(options.states)[0],
          // select: undefined,
          // where: undefined,
          // filter: undefined,
          // includeFirst: undefined,
          // requireFirst: undefined,
          offset: options.offset,
          limit: options.limit ?? DEFAULT_QUERY_LIMIT,
        }),
      ),
    );
  }

  findUnique<I extends State, O extends State>(): ExecFn<'FindUnique', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  findUniqueOrThrow<I extends State, O extends State>(): ExecFn<
    'FindUniqueOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  findFirst<I extends State, O extends State>(): ExecFn<'FindFirst', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  findFirstOrThrow<I extends State, O extends State>(): ExecFn<
    'FindFirstOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  createMany<I extends State, O extends State>(): ExecFn<'CreateMany', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  createOne<I extends State, O extends State>(): ExecFn<'CreateOne', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  updateMany<I extends State, O extends State>(): ExecFn<'UpdateMany', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  updateFirst<I extends State, O extends State>(): ExecFn<'UpdateFirst', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  updateFirstOrThrow<I extends State, O extends State>(): ExecFn<
    'UpdateFirstOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  updateUnique<I extends State, O extends State>(): ExecFn<
    'UpdateUnique',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  updateUniqueOrThrow<I extends State, O extends State>(): ExecFn<
    'UpdateUniqueOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  deleteMany<I extends State, O extends State>(): ExecFn<'DeleteMany', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  deleteFirst<I extends State, O extends State>(): ExecFn<'DeleteFirst', I, O> {
    return this.exec(async (metadata, options) => {});
  }

  deleteFirstOrThrow<I extends State, O extends State>(): ExecFn<
    'DeleteFirstOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  deleteUnique<I extends State, O extends State>(): ExecFn<
    'DeleteUnique',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  deleteUniqueOrThrow<I extends State, O extends State>(): ExecFn<
    'DeleteUniqueOrThrow',
    I,
    O
  > {
    return this.exec(async (metadata, options) => {});
  }

  // private helpers

  private toEntityList(list: StoreList): EntityList<Entity<State>> {
    return Object.assign(
      list.map((item) => this.toEntity(item)),
      { nextOffset: list.nextOffset },
    );
  }

  private toEntity(document: StoreDocument): Entity<State> {}

  private exec<T extends QueryType, I extends State, O extends State>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec: (metadata: Metadata, options: QueryOptions<T, I, O>) => Promise<any>,
  ): ExecFn<T, I, O> {
    const { metadata } = this;

    return async function () {
      return exec(await metadata, this);
    };
  }
}
