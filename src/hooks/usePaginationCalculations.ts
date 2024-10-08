import { useMemo } from 'react';
import { PaginationInfo } from '@/types/pagination';

interface UsePaginationCalculationsProps {
  totalCount: number;
  pageSize: number;
  currentCursor?: string;
  firstItemId?: number;
}

export const usePaginationCalculations = ({
  totalCount,
  pageSize,
  currentCursor,
  firstItemId,
}: UsePaginationCalculationsProps): PaginationInfo => {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const currentPage = firstItemId
      ? Math.floor(firstItemId / pageSize) + 1
      : 1;
    const currentStartIndex = firstItemId || 1;

    return {
      currentPage,
      totalPages,
      totalCount,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      endCursor: currentCursor,
      currentStartIndex,
    };
  }, [totalCount, pageSize, currentCursor, firstItemId]);
};
