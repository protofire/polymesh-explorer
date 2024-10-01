import { useQuery } from '@tanstack/react-query';
import { Polymesh, BigNumber } from '@polymeshassociation/polymesh-sdk';
import { useMemo } from 'react';
import { PolymeshEntityType } from '@/domain/entities/PolymeshEntity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { isDid } from '@/services/polymesh/isIdentifier';
import { SearchCriteria } from '@/domain/criteria/SearchCriteria';
import { Account } from '@/domain/entities/Account';
import { Identity } from '@/domain/entities/Identity';
import { Venue } from '@/domain/entities/Venue';
import { Asset } from '@/domain/entities/Asset';
import { IdentityGraphRepo } from '@/services/repositories/IdentityGraphRepo';

async function identifyPolymeshEntity(
  sdk: Polymesh,
  input: string,
): Promise<PolymeshEntityType> {
  const identifier = input.trim();

  if (sdk.accountManagement.isValidAddress({ address: identifier })) {
    return PolymeshEntityType.Account;
  }

  if (isDid(identifier)) {
    const isIdentityValid = await sdk.identities.isIdentityValid({
      identity: identifier,
    });

    return isIdentityValid
      ? PolymeshEntityType.DID
      : PolymeshEntityType.Unknown;
  }

  if (Number(identifier)) {
    try {
      await sdk.settlements.getVenue({ id: new BigNumber(identifier) });
      return PolymeshEntityType.Venue;
    } catch (error) {
      // if it doesn't exist, continue to the next check
    }
  }

  try {
    await sdk.assets.getAsset({ ticker: identifier });
    return PolymeshEntityType.Asset;
  } catch (error) {
    // if it doesn't exist, continue to the next check
  }

  return PolymeshEntityType.Unknown;
}

export interface UseSearchPolymeshEntityResult {
  searchCriteria: SearchCriteria;
  entity?: Account | Identity | Venue | Asset;
}

export const useSearchPolymeshEntity = (input: SearchCriteria) => {
  const { polymeshService, graphQlClient } = usePolymeshSdkService();
  const { identityService } = useMemo(() => {
    return { identityService: new IdentityGraphRepo(graphQlClient) };
  }, [graphQlClient]);

  return useQuery<UseSearchPolymeshEntityResult, Error>({
    queryKey: ['useSearchPolymeshEntity', input],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) return { searchCriteria: input };

      let data: Account | Identity | Venue | Asset | undefined;
      const polymeshEntity = await identifyPolymeshEntity(
        polymeshService.polymeshSdk,
        input.searchTerm,
      );
      const searchCriteria = { ...input, type: polymeshEntity };

      switch (polymeshEntity) {
        case PolymeshEntityType.Account: {
          const balance =
            await polymeshService.polymeshSdk.accountManagement.getAccountBalance(
              {
                account: input.searchTerm,
              },
            );
          data = {
            balance: balance.total.toString(),
            key: searchCriteria.searchTerm,
          };
          break;
        }
        case PolymeshEntityType.DID: {
          const exists = await identityService.existsByIdentifier(
            searchCriteria.searchTerm,
          );
          if (exists) {
            const identityData = await identityService.findByIdentifier(
              searchCriteria.searchTerm,
            );

            data = {
              did: input.searchTerm,
              ...identityData,
              primaryAccount: identityData?.primaryAccount || '',
            } as Identity;
          }
          break;
        }
        case PolymeshEntityType.Venue: {
          const venue = await polymeshService.polymeshSdk.settlements.getVenue({
            id: new BigNumber(input.searchTerm),
          });
          const venueDetails = await venue.details();
          data = {
            id: venue.id,
            uuid: venue.uuid,
            details: {
              description: venueDetails.description,
              owner: venueDetails.owner.did,
              type: venueDetails.type,
            },
          };
          break;
        }
        case PolymeshEntityType.Asset: {
          const asset = await polymeshService.polymeshSdk.assets.getAsset({
            ticker: input.searchTerm,
          });
          data = {
            ticker: asset.ticker,
            did: asset.did,
            uuid: asset.uuid,
          };
          break;
        }
        default:
          break;
      }

      return { searchCriteria, entity: data };
    },
    enabled: !!input.searchTerm,
    initialData: { searchCriteria: input },
  });
};
