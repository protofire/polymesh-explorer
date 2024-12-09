import { useQueries } from '@tanstack/react-query';
import { FungibleAsset } from '@polymeshassociation/polymesh-sdk/api/entities/Asset/Fungible';
import { Permissions } from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Account, AccountDetails } from '@/domain/entities/Account';
import { customReportError } from '@/utils/customReportError';
import { Asset } from '@/domain/entities/Asset';
import { uuidToHex } from '@/services/polymesh/hexToUuid';

export interface UseGetAccountDetailsReturn {
  accountDetails: AccountDetails | null;
  status: {
    isLoadingPermissions: boolean;
    isLoadingSubsidies: boolean;
    isFetchedPermissions: boolean;
    isFetchedSubsidies: boolean;
  };
  error: {
    permissionsError: Error | null;
    subsidiesError: Error | null;
  };
}

async function transformPermissions(permissions: Permissions) {
  if (!permissions) {
    return permissions;
  }
  let transformedAssets = null;

  if (permissions.assets) {
    const values: Asset[] = await Promise.all(
      permissions.assets.values.map(async (asset: FungibleAsset) => {
        const assetDetails = await asset.details();
        return {
          assetId: uuidToHex(asset.id),
          assetUuid: asset.id,
          ticker: assetDetails.ticker,
          name: assetDetails.name,
          type: assetDetails.assetType,
          ownerDid: assetDetails.owner.did,
          isNftCollection: assetDetails.nonFungible,
          isDivisible: assetDetails.isDivisible,
        } as Asset;
      }),
    );

    transformedAssets = {
      ...permissions.assets,
      values,
    };
  }

  return {
    ...permissions,
    assets: transformedAssets,
  };
}

export const useGetAccountDetails = (
  account: Account | null | undefined,
): UseGetAccountDetailsReturn => {
  const { polymeshService } = usePolymeshSdkService();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['useGetAccountDetailsPermissions', account?.key],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk || !account?.polymeshSdkClass) {
            throw new Error('Polymesh SDK or Account SDK not initialized');
          }
          try {
            if (
              account.identityRelationship === 'MultiSigSigner' ||
              account.identityRelationship === 'Unassigned'
            ) {
              return null;
            }

            const permissions = await account.polymeshSdkClass.getPermissions();
            const transformedPermissions =
              await transformPermissions(permissions);

            return transformedPermissions;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService && !!account && !!account.polymeshSdkClass,
      },
      {
        queryKey: ['useGetAccountDetailsSubsidies', account?.key],
        queryFn: async () => {
          if (!polymeshService?.polymeshSdk || !account?.polymeshSdkClass) {
            throw new Error('Polymesh SDK or Account SDK not initialized');
          }
          try {
            const [beneficiaries, subsidizer] = await Promise.all([
              account.polymeshSdkClass.subsidies.getBeneficiaries(),
              account.polymeshSdkClass.subsidies.getSubsidizer(),
            ]);
            return { beneficiaries, subsidizer };
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!polymeshService && !!account && !!account.polymeshSdkClass,
      },
    ],
  });

  const [permissionsQuery, subsidiesQuery] = queries;

  const accountDetails: AccountDetails | null = account
    ? {
        ...account,
        permissions: permissionsQuery.data || null,
        subsidies: subsidiesQuery.data
          ? {
              beneficiaries: subsidiesQuery.data.beneficiaries,
              subsidizer: subsidiesQuery.data.subsidizer,
            }
          : null,
      }
    : null;

  return {
    accountDetails,
    status: {
      isLoadingPermissions: permissionsQuery.isLoading,
      isLoadingSubsidies: subsidiesQuery.isLoading,
      isFetchedPermissions: permissionsQuery.isFetched,
      isFetchedSubsidies: subsidiesQuery.isFetched,
    },
    error: {
      permissionsError: permissionsQuery.error as Error | null,
      subsidiesError: subsidiesQuery.error as Error | null,
    },
  };
};
