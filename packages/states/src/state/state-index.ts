export interface StateIndex {
  name: string;
  fields: Record<string, 'asc' | 'desc'>;
  unique?: boolean;
}

export interface StatePrimaryKey extends StateIndex {
  unique: true;
  auto?: 'increment';
}

export const StateIndexNameRegex = /^[\w.]+$/i;
