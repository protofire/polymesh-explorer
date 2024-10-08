import { PaginationInfo } from '@/types/pagination';

interface CalculatePaginationInfoParams {
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  endCursor?: string;
  currentStartIndex: number;
}

export function calculatePaginationInfo({
  totalCount,
  pageSize,
  hasNextPage,
  endCursor,
  currentStartIndex,
}: CalculatePaginationInfoParams): PaginationInfo {
  return {
    totalCount,
    pageSize,
    hasNextPage,
    endCursor,
    currentStartIndex,
  };
}
