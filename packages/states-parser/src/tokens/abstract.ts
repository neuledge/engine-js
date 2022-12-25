export interface AbstractToken<T extends string> {
  type: T;
  path?: string;
  start: number;
  end: number;
}
