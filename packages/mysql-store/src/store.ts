import { Pool, PoolConfig, createPool } from 'mysql';
import { SQLStore } from '@neuledge/sql-store';

export type MySQLStoreOptions = PoolConfig;

export class MySQLStore extends SQLStore {
  private pool: Pool;

  constructor(options: MySQLStoreOptions) {
    const pool = createPool(options);

    super({
      query: (sql, values) =>
        new Promise((resolve, reject) =>
          pool.query(sql, values, (error, results) =>
            error ? reject(error) : resolve(results),
          ),
        ),
    });

    this.pool = pool;
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) =>
      this.pool.end((error) => (error ? reject(error) : resolve())),
    );
  }
}
