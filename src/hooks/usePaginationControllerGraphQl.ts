import { useState, useCallback, useMemo } from 'react';
import {
  PaginationInfo,
  PaginationController,
  PageInfo,
} from '@/domain/ui/PaginationInfo';

export const DEFAULT_PAGE_SIZE = 10;

interface UsePaginationControllerGraphQlOptions {
  initialPageSize?: number;
  useOffset?: boolean;
}

export function usePaginationControllerGraphQl({
  initialPageSize = DEFAULT_PAGE_SIZE,
  useOffset = false,
}: UsePaginationControllerGraphQlOptions = {}): PaginationController {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
    totalCount: 0,
    pageSize: initialPageSize,
    cursor: null,
    currentPage: 1,
    firstCursor: null,
    offset: 0,
  });

  const setPageInfo = useCallback(
    (pageInfo: PageInfo & Pick<PaginationInfo, 'totalCount'>) => {
      setPaginationInfo((prev) => ({
        ...prev,
        ...pageInfo,
        firstCursor: prev.firstCursor || prev.startCursor,
      }));
    },
    [],
  );

  const goToNextPage = useCallback(
    (event: unknown, newPage: number) => {
      setPaginationInfo((prev) => ({
        ...prev,
        cursor: prev.endCursor,
        currentPage: newPage + 1,
        offset: useOffset ? prev.offset + prev.pageSize : prev.offset,
      }));
    },
    [useOffset],
  );

  const goToPreviousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      setPaginationInfo((prev) => ({
        ...prev,
        cursor: prev.startCursor,
        currentPage: prev.currentPage - 1,
      }));
    }
  }, [paginationInfo.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setPaginationInfo((prev) => ({
      ...prev,
      cursor: null,
      currentPage: 1,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationInfo((prev) => ({
      ...prev,
      cursor: null,
      currentPage: 1,
      firstCursor: null,
      offset: 0,
    }));
  }, []);

  const changePageSize = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPageSize = parseInt(event.target.value, 10);
      setPaginationInfo((prev) => ({
        ...prev,
        pageSize: newPageSize,
        currentPage: 1,
        cursor: null,
      }));
    },
    [],
  );

  return useMemo(
    () => ({
      paginationInfo,
      setPageInfo,
      goToNextPage,
      goToPreviousPage,
      goToFirstPage,
      resetPagination,
      changePageSize,
    }),
    [
      paginationInfo,
      setPageInfo,
      goToNextPage,
      goToPreviousPage,
      goToFirstPage,
      resetPagination,
      changePageSize,
    ],
  );
}
