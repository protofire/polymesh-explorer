import { useState, useMemo } from 'react';
import {
  PaginationController,
  PaginationInfo,
} from '@/domain/ui/PaginationInfo';

export const DEFAULT_LOCAL_PAGE = 10;

export function useLocalPagination<T>(
  items: T[],
  initialPageSize: number = DEFAULT_LOCAL_PAGE,
): PaginationController & { paginatedItems: T[] } {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startCursor: null,
      endCursor: null,
      totalCount,
      pageSize,
      cursor: null,
      currentPage,
      firstCursor: null,
      offset: (currentPage - 1) * pageSize,
    };
  }, [items.length, pageSize, currentPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const setPageInfo = () => {};

  const goToNextPage = () => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
  };

  const changePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    paginationInfo,
    setPageInfo,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    resetPagination,
    changePageSize,
    paginatedItems,
  };
}

export const getItemNumber = (
  currentPage: number,
  pageSize: number,
  index: number,
): number => {
  return (currentPage - 1) * pageSize + index + 1;
};
