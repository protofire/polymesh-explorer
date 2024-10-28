import { useState, useCallback, useMemo } from 'react';
import { CriteriaBuilder } from '@/domain/criteria/CriteriaBuilder';

export interface CriteriaController<TCriteria, TFilter> {
  criteria: TFilter;
  setCriteria: <K extends keyof TFilter>(key: K, value: TFilter[K]) => void;
  buildCriteria: (pageSize: number, cursor?: string) => TCriteria;
}

type BuilderMethod<T> = (value: unknown) => CriteriaBuilder<T>;

export function useCriteriaController<
  TCriteria,
  TFilter extends Record<string, unknown>,
>(
  builder: CriteriaBuilder<TCriteria>,
  initialFilters: TFilter,
): CriteriaController<TCriteria, TFilter> {
  const [filters, setFilters] = useState<TFilter>(initialFilters);

  const setCriteria = useCallback(
    <K extends keyof TFilter>(key: K, value: TFilter[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const buildCriteria = useCallback(
    (pageSize: number, cursor?: string) => {
      let currentBuilder = builder.withPageSize(pageSize).withCursor(cursor);

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
    },
    [filters, builder],
  );

  return useMemo(
    () => ({
      criteria: filters,
      setCriteria,
      buildCriteria,
    }),
    [filters, setCriteria, buildCriteria],
  );
}
