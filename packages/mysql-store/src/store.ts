import { ConnectionOptions, PoolOptions, createPool } from 'mysql2/promise';
import { SQLStore } from '@neuledge/sql-store';

export type MySQLStoreOptions = PoolOptions & ConnectionOptions;

export class MySQLStore extends SQLStore {
  constructor(options: MySQLStoreOptions) {
    super(createPool(options));
  }
}
