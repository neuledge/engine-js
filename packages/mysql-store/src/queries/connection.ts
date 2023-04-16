import { Connection, Pool } from 'mysql';

export type MySQLConnection = Pick<Pool | Connection, 'query'>;
