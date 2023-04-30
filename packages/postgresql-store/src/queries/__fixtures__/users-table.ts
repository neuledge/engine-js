import {
  StoreCollection,
  StoreCollection_Slim,
  StoreDocument,
} from '@neuledge/store';
import { PostgreSQLTable } from '../list-tables';
import { PostgreSQLColumn } from '../list-table-columns';
import { PostgreSQLIndexAttribute } from '../list-table-statistics';

export const usersTableName = 'users';

export const usersTable_dropSql = `DROP TABLE IF EXISTS users`;

export const usersTable_createSql = `CREATE TABLE IF NOT EXISTS users (id BIGSERIAL NOT NULL, name VARCHAR(50), email VARCHAR(100) NOT NULL, phone VARCHAR(20), created_at TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL, CONSTRAINT users_pkey PRIMARY KEY (id))`;

export const usersTable_phoneAddSql = `ALTER TABLE users ADD COLUMN phone VARCHAR(20)`;

export const usersTable_emailIndexCreateSql = `CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email ASC)`;

export const usersTable_phoneEmailIndexCreateSql = `CREATE INDEX IF NOT EXISTS users_phone_email_idx ON users (phone DESC, email ASC)`;

export const usersTable: PostgreSQLTable = { table_name: usersTableName };

export const usersCollection_slim: StoreCollection_Slim = {
  name: usersTableName,
};

export const usersTableColumns: PostgreSQLColumn[] = [
  {
    column_name: 'id',
    data_type: 'integer',
    list: false,
    character_maximum_length: null,
    numeric_precision: 32,
    numeric_scale: 0,
    is_nullable: false,
    is_auto_increment: true,
  },
  {
    column_name: 'name',
    data_type: 'character varying',
    list: false,
    character_maximum_length: 50,
    numeric_precision: null,
    numeric_scale: null,
    is_nullable: true,
    is_auto_increment: null,
  },
  {
    column_name: 'email',
    data_type: 'character varying',
    list: false,
    character_maximum_length: 100,
    numeric_precision: null,
    numeric_scale: null,
    is_nullable: false,
    is_auto_increment: null,
  },
  {
    column_name: 'phone',
    data_type: 'character varying',
    list: false,
    character_maximum_length: 20,
    numeric_precision: null,
    numeric_scale: null,
    is_nullable: true,
    is_auto_increment: null,
  },
  {
    column_name: 'created_at',
    data_type: 'timestamp without time zone',
    list: false,
    character_maximum_length: null,
    numeric_precision: null,
    numeric_scale: null,
    is_nullable: false,
    is_auto_increment: null,
  },
  {
    column_name: 'updated_at',
    data_type: 'timestamp without time zone',
    list: false,
    character_maximum_length: null,
    numeric_precision: null,
    numeric_scale: null,
    is_nullable: false,
    is_auto_increment: null,
  },
];

export const usersTablePrimaryIndexes: PostgreSQLIndexAttribute[] = [
  {
    index_name: `users_id_idx`,
    column_name: 'id',
    seq_in_index: 1,
    direction: 'ASC',
    nulls: 'LAST',
    is_unique: true,
    is_primary: true,
  },
];

export const usersTableIndexes: PostgreSQLIndexAttribute[] = [
  {
    index_name: `users_email_idx`,
    column_name: 'email',
    seq_in_index: 1,
    direction: 'ASC',
    nulls: 'LAST',
    is_unique: true,
    is_primary: false,
  },
  {
    index_name: `users_phone_email_idx`,
    column_name: 'phone',
    seq_in_index: 1,
    direction: 'DESC',
    nulls: 'FIRST',
    is_unique: false,
    is_primary: false,
  },
  {
    index_name: `users_phone_email_idx`,
    column_name: 'email',
    seq_in_index: 2,
    direction: 'ASC',
    nulls: 'LAST',
    is_unique: false,
    is_primary: false,
  },
  ...usersTablePrimaryIndexes,
];

export const usersCollection: StoreCollection = {
  name: usersTableName,
  fields: {
    id: {
      name: 'id',
      type: 'number',
      list: false,
      nullable: false,
      size: null,
      precision: 32,
      scale: 0,
    },
    name: {
      name: 'name',
      type: 'string',
      list: false,
      nullable: true,
      size: 50,
      precision: null,
      scale: null,
    },
    email: {
      name: 'email',
      type: 'string',
      list: false,
      nullable: false,
      size: 100,
      precision: null,
      scale: null,
    },
    phone: {
      name: 'phone',
      type: 'string',
      list: false,
      nullable: true,
      size: 20,
      precision: null,
      scale: null,
    },
    created_at: {
      name: 'created_at',
      type: 'date-time',
      list: false,
      nullable: false,
      size: null,
      precision: null,
      scale: null,
    },
    updated_at: {
      name: 'updated_at',
      type: 'date-time',
      list: false,
      nullable: false,
      size: null,
      precision: null,
      scale: null,
    },
  },
  primaryKey: {
    name: 'id',
    fields: { id: { sort: 'asc' } },
    unique: 'primary',
    auto: 'increment',
  },
  indexes: {
    id: {
      name: 'id',
      fields: { id: { sort: 'asc' } },
      unique: 'primary',
      auto: 'increment',
    },
    email: {
      name: 'email',
      fields: { email: { sort: 'asc' } },
      unique: true,
    },
    phone_email: {
      name: 'phone_email',
      fields: { phone: { sort: 'desc' }, email: { sort: 'asc' } },
      unique: false,
    },
  },
};

export const usersTableRow1: StoreDocument = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 555 555 5555',
  created_at: new Date('2020-01-01T00:00:00.000Z'),
  updated_at: new Date('2020-01-01T00:02:00.000Z'),
};
