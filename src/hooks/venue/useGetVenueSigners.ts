import { useQuery } from '@tanstack/react-query';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { Account } from '@/domain/entities/Account';
import { customReportError } from '@/utils/customReportError';
import { Venue } from '@/domain/entities/Venue';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

interface AccountWithAddress extends Account {
  address: string;
}

export interface UseGetVenueSignersReturn {
  data: AccountWithAddress[] | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export function useGetVenueSigners(
  venue: Venue | null,
): UseGetVenueSignersReturn {
  const { polymeshService } = usePolymeshSdkService();

  return useQuery({
    queryKey: ['venue-signers', venue?.id],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk || !venue) {
        throw new Error('Polymesh SDK initialized or Venue not found');
      }

      try {
        const venueSdk = await polymeshService.polymeshSdk.settlements.getVenue(
          { id: new BigNumber(venue.id) },
        );
        const signers = await venueSdk.getAllowedSigners();

        return signers;
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!venue && !!polymeshService?.polymeshSdk,
  });
}
