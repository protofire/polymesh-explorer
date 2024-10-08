export interface PaginationInfo {
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  endCursor?: string;
  currentStartIndex: number;
}

export interface PaginatedData<T> {
  data: T[];
  paginationInfo: PaginationInfo;
}
