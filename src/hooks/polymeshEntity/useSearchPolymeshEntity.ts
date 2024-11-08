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
import { uuidToHex } from '@/services/polymesh/hexToUuid';
import { SettlementInstruction } from '@/domain/entities/SettlementInstruction';

async function searchEntities(
  sdk: Polymesh,
  identityService: IdentityGraphRepo,
  input: string,
): Promise<UseSearchPolymeshEntityResult[]> {
  const identifier = input.trim();
  const results: UseSearchPolymeshEntityResult[] = [];

  // Parallel search across all entities
  const searchPromises = [
    // Account search
    (async () => {
      if (sdk.accountManagement.isValidAddress({ address: identifier })) {
        const balance = await sdk.accountManagement.getAccountBalance({
          account: identifier,
        });
        results.push({
          searchCriteria: {
            searchTerm: identifier,
            type: PolymeshEntityType.Account,
          },
          entity: {
            balance: balance.total.toString(),
            key: identifier,
          },
        });
      }
    })(),

    // Identity search
    (async () => {
      if (isDid(identifier)) {
        // Try exact match first
        const identityData = await identityService.findByIdentifier(identifier);
        if (identityData) {
          results.push({
            searchCriteria: {
              searchTerm: identifier,
              type: PolymeshEntityType.DID,
            },
            entity: identityData,
          });
        }
      } else if (identifier.length >= 63) {
        // Find similar DIDs
        const similarIdentities = await identityService.existsByIdentifier(
          identifier.slice(0, 63),
        );

        // Add each similar identity as a result
        similarIdentities.forEach((identity) => {
          results.push({
            searchCriteria: {
              searchTerm: identity.did,
              type: PolymeshEntityType.DID,
            },
            entity: identity,
          });
        });
      }
    })(),

    // Venue search
    (async () => {
      if (Number(identifier)) {
        try {
          const venue = await sdk.settlements.getVenue({
            id: new BigNumber(identifier),
          });
          const venueDetails = await venue.details();
          results.push({
            searchCriteria: {
              searchTerm: identifier,
              type: PolymeshEntityType.Venue,
            },
            entity: {
              id: venue.id.toString(),
              type: venueDetails.type,
            },
          });
        } catch (error) {
          // Ignore error if venue is not found
        }
      }
    })(),

    // Settlement Instruction search
    (async () => {
      if (Number(identifier)) {
        try {
          const instruction = await sdk.settlements.getInstruction({
            id: new BigNumber(identifier),
          });

          results.push({
            searchCriteria: {
              searchTerm: identifier,
              type: PolymeshEntityType.Settlement,
            },
            entity: {
              id: instruction.id.toString(),
            },
          });
        } catch (error) {
          // Ignore error if venue is not found
        }
      }
    })(),

    // Asset search
    (async () => {
      try {
        let asset;
        // Search by ticker if length is valid
        if (identifier.length <= 12) {
          asset = await sdk.assets.getAsset({
            ticker: identifier.toUpperCase(),
          });
        }

        if (asset) {
          results.push({
            searchCriteria: {
              searchTerm: identifier,
              type: PolymeshEntityType.Asset,
            },
            entity: {
              assetId: asset.id,
            },
          });
        }

        // Search by assetId
        if (identifier.length > 12) {
          let assetId = identifier;
          if (!assetId.startsWith('0x')) {
            assetId = uuidToHex(identifier);
          }

          asset = await sdk.assets.getAsset({ assetId });
          results.push({
            searchCriteria: {
              searchTerm: identifier,
              type: PolymeshEntityType.Asset,
            },
            entity: {
              assetId: asset.id,
            },
          });
        }
      } catch (error) {
        // Ignore error if asset is not found
      }
    })(),
  ];

  await Promise.allSettled(searchPromises);
  return results;
}

export interface UseSearchPolymeshEntityResult {
  searchCriteria: SearchCriteria;
  entity?:
    | Partial<Account>
    | Identity
    | Venue
    | Partial<Asset>
    | Partial<SettlementInstruction>;
}

export const useSearchPolymeshEntity = (input: SearchCriteria) => {
  const { polymeshService, graphQlClient } = usePolymeshSdkService();
  const { identityService } = useMemo(() => {
    return { identityService: new IdentityGraphRepo(graphQlClient) };
  }, [graphQlClient]);

  return useQuery<UseSearchPolymeshEntityResult[], Error>({
    queryKey: ['useSearchPolymeshEntity', input],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) {
        throw new Error('PolymeshSdk service not initialized');
      }

      return searchEntities(
        polymeshService.polymeshSdk,
        identityService,
        input.searchTerm,
      );
    },
    enabled: !!input.searchTerm && !!polymeshService?.polymeshSdk,
    initialData: [],
  });
};
