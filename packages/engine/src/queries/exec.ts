export interface ExecQuery<T> {
  exec(): Promise<T>;
  then: Promise<T>['then'];
}
