export interface CriteriaBuilder<T> {
  withPageSize(pageSize: number): this;
  withCursor(cursor?: string): this;
  build(): T;
}
