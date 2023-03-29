export interface SQLConnection {
  query<T>(query: string, params?: unknown[]): Promise<T>;
}
