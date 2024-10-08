import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';
import { customReportError } from '@/utils/customReportError';

export const useCreatedIdentityGroupedByMonth = (months: number = 6) => {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;
    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useCreatedIdentityGroupedByMonth', identityService, months],
    queryFn: async () => {
      if (!identityService)
        throw new Error('Identity service is not available');
      try {
        const result =
          await identityService.getIdentityCreationCountByMonth(months);

        // Sort the data chronologically
        const sortedResult = result.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        return sortedResult;
      } catch (error) {
        customReportError(error);
        throw error; // Re-throw the error so React Query can handle it
      }
    },
    enabled: !!identityService,
  });
};