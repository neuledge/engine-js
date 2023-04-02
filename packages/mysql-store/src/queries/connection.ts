export interface SQLConnection {
  query<T>(sql: string, params?: unknown[]): Promise<T>;
}
