import { useQueries } from '@tanstack/react-query';
import { FungibleAsset } from '@polymeshassociation/polymesh-sdk/api/entities/Asset/Fungible';
import {
  DefaultPortfolio,
  NumberedPortfolio,
  Permissions,
} from '@polymeshassociation/polymesh-sdk/types';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Account, AccountDetails } from '@/domain/entities/Account';
import { customReportError } from '@/utils/customReportError';
import { Asset } from '@/domain/entities/Asset';
import { uuidToHex } from '@/services/polymesh/hexToUuid';
import { DEFAULT_PORTFOLIO_NAME, Portfolio } from '@/domain/entities/Portfolio';

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

  let assetsTransformed = null;
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

    assetsTransformed = {
      ...permissions.assets,
      values,
    };
  }

  let portfoliosTransformed = null;
  if (permissions.portfolios) {
    const values = await Promise.all(
      permissions.portfolios.values.map(
        async (portfolio: DefaultPortfolio | NumberedPortfolio) => {
          const number = portfolio.toHuman().id
            ? (portfolio.toHuman().id as string)
            : '0';
          const name = portfolio.toHuman().id
            ? await (portfolio as NumberedPortfolio).getName()
            : DEFAULT_PORTFOLIO_NAME;
          const ownerDid = portfolio.toHuman().did;
          return {
            id: `${ownerDid}/${number}`,
            name,
            number,
          } as Portfolio;
        },
      ),
    );

    portfoliosTransformed = {
      type: permissions.portfolios.type,
      values,
    };
  }

  return {
    ...permissions,
    assets: assetsTransformed,
    portfolios: portfoliosTransformed,
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
