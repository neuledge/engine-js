export interface AbstractNode<T extends string> {
  type: T;
  path?: string;
  start: number;
  end: number;
}
