import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';

export const useIdentityCreationCountByMonth = (months: number = 6) => {
  const { graphQlClient } = usePolymeshSdkService();
  const identityService = useMemo(() => {
    if (!graphQlClient) return null;
    return new IdentityGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery({
    queryKey: ['useIdentityCreationCountByMonth', identityService, months],
    queryFn: async () => {
      if (!identityService)
        throw new Error('Identity service is not available');
      try {
        const result =
          await identityService.getIdentityCreationCountByMonth(months);
        console.log('Chart data obtained:', result);
        return result;
      } catch (error) {
        console.error('Error obtaining identity creation count:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
        throw error; // Re-throw the error so React Query can handle it
      }
    },
    enabled: !!identityService,
  });
};
