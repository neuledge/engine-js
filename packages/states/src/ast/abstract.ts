export interface AbstractNode<T extends string> {
  type: T;
  start: number;
  end: number;
}
