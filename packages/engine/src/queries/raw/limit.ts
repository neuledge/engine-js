export interface LimitQuery {
  /**
   * Limit the number of returned entities.
   */
  limit(limit: number | null): this;
}

export interface LimitQueryOptions {
  limit?: number | null;
}
