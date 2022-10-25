export interface LimitQuery {
  limit(limit: number | null): this;
}

export interface LimitQueryOptions {
  limit?: number;
}
