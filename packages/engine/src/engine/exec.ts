import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { Metadata } from '@/metadata/index.js';
import { QueryOptions } from '@/queries/index.js';
import { Store, StoreDocument, StoreList } from '@/store/index.js';
import { convertSelect } from './select.js';
import { convertWhere } from './where.js';

const DEFAULT_QUERY_LIMIT = 201;

export class EngineExec {
  constructor(
    private readonly store: Store,
    private readonly metadataPromise: Promise<Metadata>,
  ) {}

  // queries

  async findMany<I extends State, O extends State>(
    options: QueryOptions<'FindMany', I, O>,
  ) {
    const metadata = await this.metadataPromise;
    const collections = metadata.getCollections(options.states);

    if (collections.length !== 1) {
      throw new Error('FindMany can only be used with one collection');
    }
    const [collection] = collections;

    // FIXME handle all options

    // options.includeMany

    return this.toEntityList(
      await this.store.find({
        collectionName: collections[0].name,
        select: options.select && convertSelect(collection, options.select),
        where: options.where && convertWhere(collection, options.where),
        // filter: undefined,
        // includeFirst: undefined,
        // requireFirst: undefined,
        offset: options.offset,
        limit: options.limit ?? DEFAULT_QUERY_LIMIT,
      }),
    );
  }

  async findUnique<I extends State, O extends State>(
    options: QueryOptions<'FindUnique', I, O>,
  ) {}

  async findUniqueOrThrow<I extends State, O extends State>(
    options: QueryOptions<'FindUniqueOrThrow', I, O>,
  ) {}

  async findFirst<I extends State, O extends State>(
    options: QueryOptions<'FindFirst', I, O>,
  ) {}

  async findFirstOrThrow<I extends State, O extends State>(
    options: QueryOptions<'FindFirstOrThrow', I, O>,
  ) {}

  async createMany<I extends State, O extends State>(
    options: QueryOptions<'CreateMany', I, O>,
  ) {}

  async createOne<I extends State, O extends State>(
    options: QueryOptions<'CreateOne', I, O>,
  ) {}

  async updateMany<I extends State, O extends State>(
    options: QueryOptions<'UpdateMany', I, O>,
  ) {}

  async updateFirst<I extends State, O extends State>(
    options: QueryOptions<'UpdateFirst', I, O>,
  ) {}

  async updateFirstOrThrow<I extends State, O extends State>(
    options: QueryOptions<'UpdateFirstOrThrow', I, O>,
  ) {}

  async updateUnique<I extends State, O extends State>(
    options: QueryOptions<'UpdateUnique', I, O>,
  ) {}

  async updateUniqueOrThrow<I extends State, O extends State>(
    options: QueryOptions<'UpdateUniqueOrThrow', I, O>,
  ) {}

  async deleteMany<I extends State, O extends State>(
    options: QueryOptions<'DeleteMany', I, O>,
  ) {}

  async deleteFirst<I extends State, O extends State>(
    options: QueryOptions<'DeleteFirst', I, O>,
  ) {}

  async deleteFirstOrThrow<I extends State, O extends State>(
    options: QueryOptions<'DeleteFirstOrThrow', I, O>,
  ) {}

  async deleteUnique<I extends State, O extends State>(
    options: QueryOptions<'DeleteUnique', I, O>,
  ) {}

  async deleteUniqueOrThrow<I extends State, O extends State>(
    options: QueryOptions<'DeleteUniqueOrThrow', I, O>,
  ) {}

  // private helpers

  private toEntityList(list: StoreList): EntityList<Entity<State>> {
    return Object.assign(
      list.map((item) => this.toEntity(item)),
      { nextOffset: list.nextOffset },
    );
  }

  private toEntity(document: StoreDocument): Entity<State> {}
}
