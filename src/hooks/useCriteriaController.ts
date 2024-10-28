import { useState, useCallback, useMemo } from 'react';
import { CriteriaBuilder } from '@/domain/criteria/CriteriaBuilder';
import { PaginationController } from '@/domain/ui/PaginationInfo';

export interface CriteriaController<TCriteria, TFilter> {
  criteria: TFilter;
  setCriteria: <K extends keyof TFilter>(key: K, value: TFilter[K]) => void;
  buildCriteria: () => TCriteria;
}

type BuilderMethod<T> = (value: unknown) => CriteriaBuilder<T>;

export function useCriteriaController<
  TCriteria,
  TFilter extends Record<string, unknown>,
>(
  builder: CriteriaBuilder<TCriteria>,
  initialFilters: TFilter,
  paginationController: PaginationController,
): CriteriaController<TCriteria, TFilter> {
  const [filters, setFilters] = useState<TFilter>(initialFilters);

  const setCriteria = useCallback(
    <K extends keyof TFilter>(key: K, value: TFilter[K]) => {
      setFilters((prev) => {
        if (prev[key] !== value) {
          paginationController.resetPagination();
        }
        return {
          ...prev,
          [key]: value,
        };
      });
    },
    [paginationController],
  );

  const buildCriteria = useCallback(() => {
    const { pageSize, cursor } = paginationController.paginationInfo;
    let currentBuilder = builder
      .withPageSize(pageSize)
      .withCursor(cursor ?? undefined);

    Object.entries(filters).forEach(([key, value]) => {
      const methodName = `with${key.charAt(0).toUpperCase()}${key.slice(
        1,
      )}` as keyof CriteriaBuilder<TCriteria>;

      const method = currentBuilder[methodName];
      if (typeof method === 'function') {
        currentBuilder = (method as BuilderMethod<TCriteria>).call(
          currentBuilder,
          value,
        );
      }
    });

    return currentBuilder.build();
  }, [filters, builder, paginationController]);

  return useMemo(
    () => ({
      criteria: filters,
      setCriteria,
      buildCriteria,
    }),
    [filters, setCriteria, buildCriteria],
  );
}
