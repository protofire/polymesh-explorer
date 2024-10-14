import { useState, useCallback, useMemo } from 'react';
import {
  PaginationInfo,
  PaginationController,
} from '@/domain/ui/PaginationInfo';

interface UsePaginationControllerGraphQlProps {
  initialPageSize?: number;
}

export const DEFAULT_PAGE_SIZE = 10;

export function usePaginationControllerGraphQl({
  initialPageSize = DEFAULT_PAGE_SIZE,
}: UsePaginationControllerGraphQlProps): PaginationController {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
    totalCount: 0,
    pageSize: initialPageSize,
    currentStartIndex: 1,
    cursor: null,
  });

  const setPageInfo = useCallback((pageInfo: Partial<PaginationInfo>) => {
    setPaginationInfo((prev) => ({
      ...prev,
      ...pageInfo,
      cursor: pageInfo.endCursor ?? prev.cursor,
    }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setPaginationInfo((prev) => ({
        ...prev,
        cursor: prev.endCursor,
        currentStartIndex: prev.currentStartIndex + prev.pageSize,
      }));
    }
  }, [paginationInfo]);

  const goToPreviousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      setPaginationInfo((prev) => ({
        ...prev,
        cursor: prev.startCursor,
        currentStartIndex: Math.max(1, prev.currentStartIndex - prev.pageSize),
      }));
    }
  }, [paginationInfo]);

  const resetPagination = useCallback(() => {
    setPaginationInfo((prev) => ({
      ...prev,
      cursor: null,
      currentStartIndex: 1,
    }));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: newPageSize,
      cursor: null,
      currentStartIndex: 1,
    }));
  }, []);

  return useMemo(
    () => ({
      paginationInfo,
      setPageInfo,
      goToNextPage,
      goToPreviousPage,
      resetPagination,
      changePageSize,
    }),
    [
      paginationInfo,
      setPageInfo,
      goToNextPage,
      goToPreviousPage,
      resetPagination,
      changePageSize,
    ],
  );
}
