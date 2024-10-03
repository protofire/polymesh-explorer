import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VenueGraphRepo } from '@/services/repositories/VenueGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Venue } from '@/domain/entities/Venue';

export function useGetVenue(id: string): UseQueryResult<Venue | null, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const venueService = useMemo(() => {
    if (!graphQlClient) return null;

    return new VenueGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<Venue | null, Error, Venue | null, [string, string]>({
    queryKey: ['venue', id],
    queryFn: async () => {
      if (!venueService) throw new Error('Venue service not initialized');

      return venueService.findById(id);
    },
  });
}
