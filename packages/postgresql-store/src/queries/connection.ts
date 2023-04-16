import { Client, Pool } from 'pg';

export type PostgreSQLConnection = Pick<Client | Pool, 'query'>;
