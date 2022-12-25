export interface StateIndex {
  fields: Record<string, 'asc' | 'desc'>;
  unique?: boolean;
}

export interface StatePrimaryKey extends StateIndex {
  unique: true;
}
