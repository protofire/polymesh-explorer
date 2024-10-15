export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export interface PaginationInfo extends PageInfo {
  totalCount: number;
  pageSize: number;
  cursor: string | null;
  currentPage: number;
  firstCursor: string | null;
  offset: number;
}

export interface PaginationController {
  paginationInfo: PaginationInfo;
  setPageInfo: (
    pageInfo: PageInfo & Pick<PaginationInfo, 'totalCount'>,
  ) => void;
  goToNextPage: (event: unknown, newPage: number) => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  resetPagination: () => void;
  changePageSize: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PaginatedData<T> {
  data: T;
  paginationController: PaginationController;
}
