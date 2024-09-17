import { useQuery } from '@tanstack/react-query';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { PolymeshEntityType } from '@/domain/entities/PolymeshEntity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { isDid } from '@/services/polymesh/isIdentifier';
import { SearchCriteria } from '@/domain/criteria/SearchCriteria';
import { Account } from '@/domain/entities/Account';
import { Identity } from '@/domain/entities/Identity';

async function identifyPolymeshEntity(
  sdk: Polymesh,
  input: string,
): Promise<PolymeshEntityType> {
  const identifier = input.trim();

  if (sdk.accountManagement.isValidAddress({ address: identifier })) {
    return 'Account';
  }

  if (isDid(identifier)) {
    const isIdentityValid = await sdk.identities.isIdentityValid({
      identity: identifier,
    });

    return isIdentityValid ? 'DID' : 'Unknown';
  }

  return 'Unknown';
}

interface UseSearchPolymeshEntityResult {
  searchCriteria: SearchCriteria;
  data?: Account | Identity;
}

export const useSearchPolymeshEntity = (input: SearchCriteria) => {
  const { polymeshService } = usePolymeshSdkService();

  return useQuery<UseSearchPolymeshEntityResult, Error>({
    queryKey: ['useSearchPolymeshEntity', input],
    queryFn: async () => {
      if (!polymeshService?.polymeshSdk) return { searchCriteria: input };

      let data: Account | Identity | undefined;
      const polymeshEntity = await identifyPolymeshEntity(
        polymeshService.polymeshSdk,
        input.searchTerm,
      );
      const searchCriteria = { ...input, type: polymeshEntity };

      if (polymeshEntity === 'Account') {
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
      } else if (polymeshEntity === 'DID') {
        data = { did: input.searchTerm };
      }

      return { searchCriteria, data };
    },
    enabled: !!input.searchTerm,
    initialData: { searchCriteria: input },
  });
};
