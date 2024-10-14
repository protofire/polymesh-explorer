export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export interface PaginationInfo extends PageInfo {
  totalCount: number;
  pageSize: number;
  currentStartIndex: number;
  cursor: string | null;
}

export interface PaginationController {
  paginationInfo: PaginationInfo;
  setPageInfo: (pageInfo: Partial<PaginationInfo>) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  resetPagination: () => void;
  changePageSize: (newPageSize: number) => void;
}

export interface PaginatedData<T> {
  data: T;
  paginationController: PaginationController;
}
